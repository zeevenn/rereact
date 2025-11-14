/**
 * DOM 组件 - 用于渲染原生 HTML 元素
 * 如 <div>, <span>, <button> 等
 */

import type { ReactElement, ReactNode } from 'shared'
import type { InternalInstance } from './types/ReactInstance'
import { instantiateReactComponent } from './instantiateReactComponent'
import { TextComponent } from './TextComponent'

/**
 * 保留属性（不应直接设置到 DOM 上）
 */
const RESERVED_PROPS = new Set(['children', 'dangerouslySetInnerHTML', 'suppressContentEditableWarning'])

/**
 * 布尔属性（应该用 setAttribute/removeAttribute）
 */
const BOOLEAN_ATTRIBUTES = new Set([
  'checked',
  'selected',
  'disabled',
  'readonly',
  'multiple',
  'autoplay',
  'controls',
  'loop',
  'muted',
  'open',
  'required',
])

/**
 * 更新操作类型
 */
type UpdateType = 'INSERT_MARKUP' | 'MOVE_EXISTING' | 'REMOVE_NODE' | 'SET_MARKUP' | 'TEXT_CONTENT'

interface Update {
  type: UpdateType
  content?: any
  fromIndex?: number | null
  fromNode?: Node | null
  toIndex?: number | null
  afterNode?: Node | null
}

export class DOMComponent implements InternalInstance {
  currentElement: ReactElement
  private _hostNode: HTMLElement | null = null
  private _renderedChildren: Record<string, InternalInstance> | null = null // 改为对象，key -> instance
  private _tag: string
  private _previousStyle: Record<string, string> | null = null
  private _eventListeners: Map<string, EventListener> = new Map()

  constructor(element: ReactElement) {
    if (typeof element.type !== 'string') {
      throw new TypeError('DOMComponent expects element.type to be a string')
    }
    this.currentElement = element
    this._tag = element.type.toLowerCase()
  }

  /**
   * 挂载组件 - 创建 DOM 节点和子元素
   */
  mountComponent(): HTMLElement {
    const { type, props } = this.currentElement

    // 创建 DOM 节点
    const node = document.createElement(type as string)
    this._hostNode = node

    // 设置属性
    this._updateProperties({}, props)

    // 处理 children
    this._mountChildren(props)

    return node
  }

  /**
   * 挂载子元素
   */
  private _mountChildren(props: any): void {
    const { dangerouslySetInnerHTML } = props
    const children = props.children

    // 处理 dangerouslySetInnerHTML
    if (dangerouslySetInnerHTML) {
      if (dangerouslySetInnerHTML.__html != null) {
        this._hostNode!.innerHTML = dangerouslySetInnerHTML.__html
      }
      return
    }

    // 扁平化 children 并挂载
    if (children != null) {
      const flattenedChildren = this._flattenChildren(children)
      const mountImages = this._mountChildrenFromFlattened(flattenedChildren)

      // 将 DOM 节点插入到父节点
      for (const mountImage of mountImages) {
        this._hostNode!.appendChild(mountImage)
      }
    }
  }

  /**
   * 从扁平化的 children 挂载子组件
   */
  private _mountChildrenFromFlattened(flattenedChildren: Record<string, ReactNode>): any[] {
    const childInstances: Record<string, InternalInstance> = {}
    const mountImages: any[] = []
    let index = 0

    for (const key in flattenedChildren) {
      const childElement = flattenedChildren[key]
      if (childElement == null)
        continue

      const childInstance = instantiateReactComponent(childElement)
      childInstances[key] = childInstance

      // 挂载子组件
      const mountImage = childInstance.mountComponent()
      childInstance._mountIndex = index++
      mountImages.push(mountImage)
    }

    this._renderedChildren = childInstances
    return mountImages
  }

  /**
   * 更新属性
   */
  private _updateProperties(prevProps: any, nextProps: any): void {
    const node = this._hostNode!

    // 移除旧属性（只在属性不再存在于 nextProps 中，或值变成 null/undefined 时移除）
    Object.keys(prevProps).forEach((propName) => {
      if (RESERVED_PROPS.has(propName)) {
        return
      }

      const prevValue = prevProps[propName]
      const nextValue = nextProps[propName]

      // 如果属性还在 nextProps 中且值不为 null，跳过移除（会在设置新属性时处理）
      if (propName in nextProps && nextValue != null) {
        return
      }

      // 如果 prevValue 本身就是 null/undefined，不需要移除
      if (prevValue == null) {
        return
      }

      if (propName.startsWith('on')) {
        // 移除事件监听器
        this._removeEventListener(propName)
      }
      else if (propName === 'style') {
        // 清空所有样式
        node.removeAttribute('style')
        this._previousStyle = null
      }
      else if (propName === 'className') {
        node.removeAttribute('class')
      }
      else if (BOOLEAN_ATTRIBUTES.has(propName)) {
        node.removeAttribute(propName)
      }
      else if (propName === 'value' && (this._tag === 'input' || this._tag === 'textarea')) {
        // value 属性特殊处理，不需要移除
      }
      else {
        node.removeAttribute(propName)
      }
    })

    // 设置新属性（只设置值有变化的属性）
    Object.keys(nextProps).forEach((propName) => {
      if (RESERVED_PROPS.has(propName)) {
        return
      }

      const propValue = nextProps[propName]
      const prevValue = prevProps[propName]

      // 跳过值没有变化的属性
      if (propValue === prevValue) {
        return
      }

      // 如果新值是 null/undefined，跳过设置（已在移除旧属性时处理）
      if (propValue == null && prevValue == null) {
        return
      }

      // 事件处理
      if (propName.startsWith('on')) {
        // 先移除旧的事件监听器
        this._removeEventListener(propName)
        // 再添加新的事件监听器
        if (propValue != null) {
          const eventType = propName.toLowerCase().substring(2)
          this._addEventListener(propName, eventType, propValue)
        }
      }
      // className
      else if (propName === 'className') {
        if (propValue != null) {
          node.className = propValue
        }
        else {
          node.removeAttribute('class')
        }
      }
      // style
      else if (propName === 'style') {
        this._updateStyle(prevValue, propValue)
      }
      // 布尔属性
      else if (BOOLEAN_ATTRIBUTES.has(propName)) {
        if (propValue) {
          node.setAttribute(propName, '')
        }
        else {
          node.removeAttribute(propName)
        }
      }
      // value 属性（特殊处理 input/textarea）
      else if (propName === 'value') {
        if (this._tag === 'input' || this._tag === 'textarea') {
          (node as HTMLInputElement).value = propValue ?? ''
        }
        else if (propValue != null) {
          node.setAttribute(propName, String(propValue))
        }
        else {
          node.removeAttribute(propName)
        }
      }
      // 普通属性
      else if (propValue != null) {
        node.setAttribute(propName, String(propValue))
      }
    })
  }

  /**
   * 更新样式（增量更新，只更新变化的样式属性）
   */
  private _updateStyle(prevStyle: any, nextStyle: any): void {
    const node = this._hostNode!

    // 如果新样式是 null/undefined，清空所有样式
    if (!nextStyle || typeof nextStyle !== 'object') {
      node.removeAttribute('style')
      this._previousStyle = null
      return
    }

    const prevStyleObj = this._previousStyle || {}

    // 移除旧样式中不再存在的属性
    Object.keys(prevStyleObj).forEach((styleName) => {
      if (!(styleName in nextStyle) || nextStyle[styleName] == null) {
        (node.style as any)[styleName] = ''
      }
    })

    // 设置新样式或更新的样式
    Object.keys(nextStyle).forEach((styleName) => {
      const styleValue = nextStyle[styleName]
      if (styleValue != null && styleValue !== prevStyleObj[styleName]) {
        // 直接使用驼峰命名设置样式
        (node.style as any)[styleName] = styleValue
      }
    })

    // 保存当前样式副本（用于下次比较）
    this._previousStyle = { ...nextStyle }
  }

  /**
   * 添加事件监听器
   */
  private _addEventListener(propName: string, eventType: string, handler: EventListener): void {
    if (!handler || typeof handler !== 'function')
      return

    const node = this._hostNode!
    // 简化：直接添加原生事件（未来可以改为合成事件）
    node.addEventListener(eventType, handler)
    // 保存监听器引用，用于后续移除
    this._eventListeners.set(propName, handler)
  }

  /**
   * 移除事件监听器
   */
  private _removeEventListener(propName: string): void {
    const handler = this._eventListeners.get(propName)
    if (!handler) {
      return
    }

    const node = this._hostNode!
    const eventType = propName.toLowerCase().substring(2)
    node.removeEventListener(eventType, handler)
    this._eventListeners.delete(propName)
  }

  /**
   * 更新组件
   */
  receiveComponent(nextElement: ReactNode): void {
    // DOMComponent 只接受 ReactElement
    if (typeof nextElement !== 'object' || nextElement == null) {
      throw new TypeError('DOMComponent.receiveComponent expects ReactElement')
    }

    const nextElementTyped = nextElement as ReactElement
    const prevElement = this.currentElement
    const prevProps = prevElement.props
    const nextProps = nextElementTyped.props

    this.currentElement = nextElementTyped

    // 更新属性
    this._updateProperties(prevProps, nextProps)

    // 更新子元素
    this._updateChildren(prevProps.children, nextProps.children)
  }

  /**
   * 更新子元素（完整 diff 算法）
   */
  private _updateChildren(prevChildren: any, nextChildren: any): void {
    const CONTENT_TYPES: Record<string, boolean> = { string: true, number: true }

    // 检查 children 类型
    const prevContent = CONTENT_TYPES[typeof prevChildren] ? prevChildren : null
    const nextContent = CONTENT_TYPES[typeof nextChildren] ? nextChildren : null

    const prevChildrenElements = prevContent != null ? null : prevChildren
    const nextChildrenElements = nextContent != null ? null : nextChildren

    // 处理类型切换
    if (prevChildrenElements != null && nextChildrenElements == null) {
      // 从 React 元素切换到文本
      this._updateTextContent('')
    }

    // 应用新的 children
    if (nextContent != null) {
      // 文本内容：如果之前也是文本内容，尝试更新现有的 TextComponent
      if (prevContent != null) {
        // 之前也是文本内容，尝试更新现有的 TextComponent
        const existingTextInstance = this._renderedChildren?.['.0']
        if (existingTextInstance && existingTextInstance instanceof TextComponent) {
          // 更新现有的 TextComponent
          existingTextInstance.receiveComponent(`${nextContent}`)
        }
        else {
          // 之前不是文本内容，需要切换
          this._updateTextContent(`${nextContent}`)
        }
      }
      else {
        // 之前没有内容，直接设置文本内容
        this._updateTextContent(`${nextContent}`)
      }
    }
    else if (nextChildrenElements != null) {
      // React 元素：执行 diff 算法
      this._updateChildrenElements(prevChildrenElements, nextChildrenElements)
    }
  }

  /**
   * 更新 React 元素子节点（核心 diff 算法）
   */
  private _updateChildrenElements(prevChildren: any, nextChildren: any): void {
    const _prevChildrenFlattened = prevChildren != null ? this._flattenChildren(prevChildren) : null
    const nextChildrenFlattened = nextChildren != null ? this._flattenChildren(nextChildren) : null

    const removedNodes: Record<string, Node> = {}
    const mountImages: any[] = []

    // 1. 调用协调器进行 diff（真正的 diff 算法）
    const nextChildInstances = this._reconcilerUpdateChildren(
      this._renderedChildren,
      nextChildrenFlattened,
      mountImages,
      removedNodes,
    )

    if (!nextChildInstances && !this._renderedChildren) {
      return
    }

    // 2. 生成更新队列
    const updates: Update[] = []
    let nextIndex = 0
    let lastIndex = 0
    let nextMountIndex = 0
    let lastPlacedNode: Node | null = null

    // 遍历新的子组件，生成移动/插入操作
    for (const key in nextChildInstances) {
      const prevChild = this._renderedChildren?.[key]
      const nextChild = nextChildInstances[key]

      if (prevChild === nextChild) {
        // 相同组件：可能需要移动
        const update = this._moveChild(prevChild, lastPlacedNode, nextIndex, lastIndex)
        if (update) {
          updates.push(update)
        }
        lastIndex = Math.max(prevChild._mountIndex ?? 0, lastIndex)
        prevChild._mountIndex = nextIndex
      }
      else {
        // 不同组件：需要插入
        if (prevChild) {
          lastIndex = Math.max(prevChild._mountIndex ?? 0, lastIndex)
        }
        const update = this._mountChildAtIndex(
          nextChild,
          mountImages[nextMountIndex],
          lastPlacedNode,
          nextIndex,
        )
        if (update) {
          updates.push(update)
        }
        nextMountIndex++
      }
      nextIndex++
      lastPlacedNode = this._getHostNodeFromInstance(nextChild)
    }

    // 3. 处理删除的节点
    for (const key in removedNodes) {
      const prevChild = this._renderedChildren?.[key]
      if (prevChild) {
        const update = this._unmountChild(prevChild, removedNodes[key])
        if (update) {
          updates.push(update)
        }
      }
    }

    // 4. 执行更新队列
    if (updates.length > 0) {
      this._processUpdateQueue(updates)
    }

    this._renderedChildren = nextChildInstances
  }

  /**
   * 协调器更新子组件（真正的 diff 算法）
   */
  private _reconcilerUpdateChildren(
    prevChildren: Record<string, InternalInstance> | null,
    nextChildrenFlattened: Record<string, ReactNode> | null,
    mountImages: any[],
    removedNodes: Record<string, Node>,
  ): Record<string, InternalInstance> | null {
    if (!nextChildrenFlattened && !prevChildren) {
      return null
    }

    const nextChildInstances: Record<string, InternalInstance> = {}

    // 遍历新的子元素
    for (const key in nextChildrenFlattened) {
      const prevChild = prevChildren?.[key]
      const prevElement = prevChild?.currentElement
      const nextElement = nextChildrenFlattened[key]

      // Diff 算法核心：判断是否可以复用
      if (prevChild != null && this._shouldUpdateReactComponent(prevElement, nextElement)) {
        // 情况1：可以复用 → 更新现有组件
        prevChild.receiveComponent(nextElement)
        nextChildInstances[key] = prevChild
      }
      else {
        // 情况2：不能复用 → 替换组件
        if (prevChild) {
          const hostNode = this._getHostNodeFromInstance(prevChild)
          if (hostNode) {
            removedNodes[key] = hostNode
          }
          prevChild.unmountComponent()
        }
        // 创建新组件
        const nextChildInstance = instantiateReactComponent(nextElement)
        nextChildInstances[key] = nextChildInstance
        const nextChildMountImage = nextChildInstance.mountComponent()
        mountImages.push(nextChildMountImage)
      }
    }

    // 情况3：删除不再存在的子组件
    if (prevChildren) {
      for (const key in prevChildren) {
        if (!(key in nextChildInstances)) {
          const prevChild = prevChildren[key]
          const hostNode = this._getHostNodeFromInstance(prevChild)
          if (hostNode) {
            removedNodes[key] = hostNode
          }
          prevChild.unmountComponent()
        }
      }
    }

    return nextChildInstances
  }

  /**
   * 判断是否可以复用组件
   */
  private _shouldUpdateReactComponent(prevElement: any, nextElement: any): boolean {
    const prevEmpty = prevElement === null || prevElement === false
    const nextEmpty = nextElement === null || nextElement === false

    if (prevEmpty || nextEmpty) {
      return prevEmpty === nextEmpty
    }

    const prevType = typeof prevElement
    const nextType = typeof nextElement

    // 字符串或数字类型
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number'
    }

    // ReactElement 类型：需要 key 和 type 都相同
    if (prevType === 'object' && nextType === 'object') {
      return (
        prevElement.type === nextElement.type
        && prevElement.key === nextElement.key
      )
    }

    return false
  }

  /**
   * 扁平化 children（处理数组、单个元素等）
   */
  private _flattenChildren(children: any): Record<string, ReactNode> {
    if (children == null) {
      return {}
    }

    const result: Record<string, ReactNode> = {}

    // 单个元素（ReactElement、string、number）
    if (
      children === null
      || typeof children === 'string'
      || typeof children === 'number'
      || (typeof children === 'object' && children.$$typeof)
    ) {
      const key = this._getComponentKey(children, 0)
      result[key] = children
      return result
    }

    // 数组
    if (Array.isArray(children)) {
      children.forEach((child, index) => {
        if (child == null)
          return
        const key = this._getComponentKey(child, index)
        result[key] = child
      })
      return result
    }

    // 其他情况（单个对象）
    const key = this._getComponentKey(children, 0)
    result[key] = children
    return result
  }

  /**
   * 获取组件的 key
   */
  private _getComponentKey(component: any, index: number): string {
    if (component && typeof component === 'object' && component.key != null) {
      // 显式 key
      return `.${String(component.key)}`
    }
    // 隐式 key（使用索引）
    return `.${index.toString(36)}`
  }

  /**
   * 移动子组件
   */
  private _moveChild(
    child: InternalInstance,
    afterNode: Node | null,
    toIndex: number,
    lastIndex: number,
  ): Update | null {
    // 如果 child 的索引小于 lastIndex，需要移动
    if ((child._mountIndex ?? 0) < lastIndex) {
      return {
        type: 'MOVE_EXISTING',
        fromIndex: child._mountIndex ?? null,
        fromNode: this._getHostNodeFromInstance(child),
        toIndex,
        afterNode,
      }
    }
    return null
  }

  /**
   * 在指定位置挂载子组件
   */
  private _mountChildAtIndex(
    child: InternalInstance,
    mountImage: any,
    afterNode: Node | null,
    index: number,
  ): Update {
    child._mountIndex = index
    return this._createChild(child, afterNode, mountImage)
  }

  /**
   * 创建子组件更新
   */
  private _createChild(child: InternalInstance, afterNode: Node | null, mountImage: any): Update {
    return {
      type: 'INSERT_MARKUP',
      content: mountImage,
      toIndex: child._mountIndex ?? null,
      afterNode,
    }
  }

  /**
   * 卸载子组件
   */
  private _unmountChild(child: InternalInstance, node: Node): Update {
    const update = this._removeChild(child, node)
    child._mountIndex = null
    return update
  }

  /**
   * 移除子组件更新
   */
  private _removeChild(child: InternalInstance, node: Node): Update {
    return {
      type: 'REMOVE_NODE',
      fromIndex: child._mountIndex ?? null,
      fromNode: node,
    }
  }

  /**
   * 处理更新队列
   */
  private _processUpdateQueue(updates: Update[]): void {
    const node = this._hostNode!
    if (!node)
      return

    for (const update of updates) {
      switch (update.type) {
        case 'INSERT_MARKUP':
          this._insertChildAt(
            node,
            update.content,
            this._getNodeAfter(node, update.afterNode ?? null),
          )
          break
        case 'MOVE_EXISTING':
          this._moveChildNode(
            node,
            update.fromNode!,
            this._getNodeAfter(node, update.afterNode ?? null),
          )
          break
        case 'REMOVE_NODE':
          this._removeChildNode(node, update.fromNode!)
          break
        case 'SET_MARKUP':
          node.innerHTML = update.content
          break
        case 'TEXT_CONTENT':
          node.textContent = update.content
          break
      }
    }
  }

  /**
   * 在指定位置插入子节点
   */
  private _insertChildAt(parentNode: Node, childNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(childNode, referenceNode)
  }

  /**
   * 移动子节点
   */
  private _moveChildNode(parentNode: Node, childNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(childNode, referenceNode)
  }

  /**
   * 移除子节点
   */
  private _removeChildNode(parentNode: Node, childNode: Node): void {
    if (Array.isArray(childNode)) {
      // 文本节点：[开始注释, 结束注释]
      const [openingComment, closingComment] = childNode
      let node = openingComment.nextSibling
      while (node && node !== closingComment) {
        const nextNode = node.nextSibling
        parentNode.removeChild(node)
        node = nextNode
      }
      parentNode.removeChild(openingComment)
      parentNode.removeChild(closingComment)
    }
    else {
      parentNode.removeChild(childNode)
    }
  }

  /**
   * 获取参考节点之后的位置
   */
  private _getNodeAfter(parentNode: Node, node: Node | null): Node | null {
    if (Array.isArray(node)) {
      // 文本节点：[开始注释, 结束注释]
      return node[1]
    }
    return node ? node.nextSibling : parentNode.firstChild
  }

  /**
   * 从实例获取 Host 节点
   */
  private _getHostNodeFromInstance(instance: InternalInstance): Node | null {
    const hostNode = instance.getHostNode()
    return hostNode as Node | null
  }

  /**
   * 更新文本内容
   */
  private _updateTextContent(nextContent: string): void {
    const node = this._hostNode!
    if (!node)
      return

    // 卸载旧的子组件
    if (this._renderedChildren) {
      this._unmountChildren()
    }

    // 使用 TextComponent 处理文本内容，确保使用注释节点包裹
    const textInstance = instantiateReactComponent(nextContent)
    const textFragment = textInstance.mountComponent()
    textInstance._mountIndex = 0
    this._renderedChildren = { '.0': textInstance }
    node.appendChild(textFragment)
  }

  /**
   * 卸载所有子组件
   */
  private _unmountChildren(): void {
    if (!this._renderedChildren)
      return

    for (const key in this._renderedChildren) {
      const child = this._renderedChildren[key]
      child.unmountComponent()
    }

    this._renderedChildren = null
  }

  /**
   * 卸载组件
   */
  unmountComponent(): void {
    if (!this._hostNode)
      return

    // 卸载所有子组件
    this._unmountChildren()

    // 移除所有事件监听器
    this._eventListeners.forEach((handler, propName) => {
      const eventType = propName.toLowerCase().substring(2)
      this._hostNode!.removeEventListener(eventType, handler)
    })
    this._eventListeners.clear()

    // 清理引用
    this._hostNode = null
    this._previousStyle = null
  }

  /**
   * 获取 DOM 节点
   */
  getHostNode(): HTMLElement | null {
    return this._hostNode
  }

  /**
   * 获取公共实例（返回 DOM 节点）
   */
  getPublicInstance(): HTMLElement | null {
    return this._hostNode
  }
}
