/**
 * DOM 组件 - 用于渲染原生 HTML 元素
 * 如 <div>, <span>, <button> 等
 */

import type { ReactElement } from 'shared'
import type { InternalInstance } from './types/ReactInstance'
import { instantiateReactComponent } from './instantiateReactComponent'

/**
 * 保留属性（不应直接设置到 DOM 上）
 */
const RESERVED_PROPS = new Set(['children', 'key', 'ref', 'dangerouslySetInnerHTML'])

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

export class DOMComponent implements InternalInstance {
  private _currentElement: ReactElement
  private _hostNode: HTMLElement | null = null
  private _childInstances: InternalInstance[] = []
  private _tag: string

  constructor(element: ReactElement) {
    if (typeof element.type !== 'string') {
      throw new TypeError('DOMComponent expects element.type to be a string')
    }
    this._currentElement = element
    this._tag = element.type.toLowerCase()
  }

  /**
   * 挂载组件 - 创建 DOM 节点和子元素
   */
  mountComponent(): HTMLElement {
    const { type, props } = this._currentElement

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
    const children = props.children || []

    // 处理 dangerouslySetInnerHTML
    if (dangerouslySetInnerHTML) {
      if (dangerouslySetInnerHTML.__html != null) {
        this._hostNode!.innerHTML = dangerouslySetInnerHTML.__html
      }
      return
    }

    // 如果 children 是数组，遍历处理每个子元素
    const childrenArray = Array.isArray(children) ? children : [children]

    childrenArray.forEach((child) => {
      const childInstance = instantiateReactComponent(child)
      this._childInstances.push(childInstance)
      const childNode = childInstance.mountComponent()
      this._hostNode!.appendChild(childNode)
    })
  }

  /**
   * 更新属性
   */
  private _updateProperties(prevProps: any, nextProps: any): void {
    const node = this._hostNode!

    // 移除旧属性
    Object.keys(prevProps).forEach((propName) => {
      if (
        RESERVED_PROPS.has(propName)
        || propName in nextProps
        || prevProps[propName] == null
      ) {
        return
      }

      if (propName.startsWith('on')) {
        // 移除事件监听器（简化：不处理）
      }
      else if (propName === 'style') {
        // 清空样式
        node.removeAttribute('style')
      }
      else if (propName === 'className') {
        node.removeAttribute('class')
      }
      else {
        node.removeAttribute(propName)
      }
    })

    // 设置新属性
    Object.keys(nextProps).forEach((propName) => {
      if (RESERVED_PROPS.has(propName)) {
        return
      }

      const propValue = nextProps[propName]

      // 事件处理
      if (propName.startsWith('on')) {
        const eventType = propName.toLowerCase().substring(2)
        this._addEventListener(eventType, propValue)
      }
      // className
      else if (propName === 'className') {
        if (propValue != null) {
          node.className = propValue
        }
      }
      // style
      else if (propName === 'style') {
        this._setStyle(propValue)
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
        else {
          node.setAttribute(propName, propValue)
        }
      }
      // 普通属性
      else if (propValue != null) {
        node.setAttribute(propName, String(propValue))
      }
    })
  }

  /**
   * 设置样式
   */
  private _setStyle(styleObj: any): void {
    if (!styleObj || typeof styleObj !== 'object')
      return

    const node = this._hostNode!
    Object.keys(styleObj).forEach((styleName) => {
      const styleValue = styleObj[styleName]
      if (styleValue != null) {
        // 直接使用驼峰命名设置样式
        (node.style as any)[styleName] = styleValue
      }
    })
  }

  /**
   * 添加事件监听器
   */
  private _addEventListener(eventType: string, handler: EventListener): void {
    if (!handler || typeof handler !== 'function')
      return

    const node = this._hostNode!
    // 简化：直接添加原生事件（未来可以改为合成事件）
    node.addEventListener(eventType, handler)
  }

  /**
   * 更新组件
   */
  receiveComponent(nextElement: ReactElement): void {
    const prevElement = this._currentElement
    const prevProps = prevElement.props
    const nextProps = nextElement.props

    this._currentElement = nextElement

    // 更新属性
    this._updateProperties(prevProps, nextProps)

    // 更新子元素
    this._updateChildren(prevProps.children, nextProps.children)
  }

  /**
   * 更新子元素（简化版，不做 key diff）
   */
  private _updateChildren(prevChildren: any, nextChildren: any): void {
    // 简化实现：直接替换所有子元素
    // 实际 React 会做复杂的 diff 算法

    // 卸载所有旧子元素
    this._childInstances.forEach(instance => instance.unmountComponent())
    this._childInstances = []

    // 清空 DOM
    this._hostNode!.innerHTML = ''

    // 重新挂载新子元素
    this._mountChildren({ children: nextChildren })
  }

  /**
   * 卸载组件
   */
  unmountComponent(): void {
    if (!this._hostNode)
      return

    // 卸载所有子组件
    this._childInstances.forEach(instance => instance.unmountComponent())
    this._childInstances = []

    // 移除所有事件监听器（简化：通过克隆节点）
    // 注：实际应该记录所有事件并逐个移除

    // 清理引用
    this._hostNode = null
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
