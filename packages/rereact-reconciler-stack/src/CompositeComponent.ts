import type { ClassComponent, FunctionComponent, ReactElement, ReactNode } from 'shared'
import type { InternalInstance } from './types/ReactInstance'
import { instantiateReactComponent } from './instantiateReactComponent'

/**
 * 复合组件 - 用于渲染用户自定义的函数组件或类组件
 * 函数组件返回的元素会被递归处理，直到得到 DOM 节点
 */
export class CompositeComponent implements InternalInstance {
  /**
   * 公共实例(类组件实例或函数组件实例)
   */
  private _publicInstance: any | null = null
  /**
   * 当前 jsx 元素
   */
  currentElement: ReactElement
  /**
   * 渲染实例
   */
  private _renderedInstance: InternalInstance | null = null

  constructor(element: ReactElement) {
    this.currentElement = element
  }

  /**
   * 挂载组件 - 调用函数组件并递归挂载渲染的元素
   */
  mountComponent(): Node {
    const { type, props } = this.currentElement

    let publicInstance: any | null = null
    let renderedElement: ReactNode | null = null
    if (isClassComponent(type)) {
      // 实例化组件类
      // 注意：如果组件在 constructor 中初始化了 state（如 this.state = { count: 0 }），
      // 那么 state 已经在实例化时设置了
      publicInstance = new (type as ClassComponent)(props)
      publicInstance.props = props

      // 如果组件没有在 constructor 中初始化 state，则设置为空对象
      // 这确保了 setState 方法可以正常工作
      if (!publicInstance.state) {
        publicInstance.state = {}
      }

      // 实现 setState 方法
      publicInstance.setState = (partialState: any, callback?: () => void) => {
        this._updateState(partialState, callback)
      }

      // 调用 componentWillMount 生命周期方法
      publicInstance.componentWillMount?.()

      renderedElement = publicInstance.render()
    }
    else if (typeof type === 'function') {
      // 函数组件(stateless component)
      publicInstance = null
      renderedElement = (type as FunctionComponent)(props)
    }

    // 保存公共实例
    this._publicInstance = publicInstance

    // 根据元素，实例化内部实例
    this._renderedInstance = instantiateReactComponent(renderedElement)

    return this._renderedInstance.mountComponent()
  }

  /**
   * 更新组件 - 重新调用函数组件并更新子组件
   * 注意：DOM 节点的替换由父组件（DOMComponent）处理
   */
  receiveComponent(nextElement: ReactNode): void {
    // CompositeComponent 只接受 ReactElement
    if (typeof nextElement !== 'object' || nextElement == null) {
      throw new TypeError('CompositeComponent.receiveComponent expects ReactElement')
    }

    const publicInstance = this._publicInstance
    const { type, props: nextProps } = nextElement as ReactElement

    // 更新当前元素
    this.currentElement = nextElement as ReactElement

    // 重新获取新的渲染元素
    let nextRenderedElement: ReactNode | null = null
    if (isClassComponent(type)) {
      publicInstance.componentWillUpdate?.(nextProps)
      // 更新 props
      publicInstance.props = nextProps
      // 重新渲染
      nextRenderedElement = publicInstance.render()
    }
    else if (typeof type === 'function') {
      nextRenderedElement = (type as FunctionComponent)(nextProps)
    }

    // 更新渲染实例
    this._updateRenderedComponent(nextRenderedElement)
  }

  /**
   * 更新组件状态（setState 的内部实现）
   */
  private _updateState(partialState: any, callback?: () => void): void {
    const publicInstance = this._publicInstance
    if (!publicInstance) {
      return
    }

    // 合并状态
    const prevState = publicInstance.state || {}
    const nextState = typeof partialState === 'function'
      ? partialState(prevState)
      : { ...prevState, ...partialState }

    publicInstance.state = nextState

    // 调用 componentWillUpdate（但 props 没变，只是 state 变了）
    publicInstance.componentWillUpdate?.(publicInstance.props)

    // 重新渲染获取新的 renderedElement
    const nextRenderedElement = publicInstance.render()

    // 更新渲染实例
    this._updateRenderedComponent(nextRenderedElement, callback)
  }

  /**
   * 更新渲染实例 - 比较新旧渲染元素，决定是更新还是替换
   * @param nextRenderedElement - 新的渲染元素
   * @param callback - 更新完成后的回调（用于 setState）
   */
  private _updateRenderedComponent(
    nextRenderedElement: ReactNode,
    callback?: () => void,
  ): void {
    const prevRenderedInstance = this._renderedInstance
    const prevRenderedElement = prevRenderedInstance?.currentElement

    // 如果组件类型没有变化，尝试更新子组件（重用 DOM）
    if (
      prevRenderedElement != null
      && nextRenderedElement != null
      && typeof prevRenderedElement === 'object'
      && typeof nextRenderedElement === 'object'
      && prevRenderedInstance
    ) {
      const prevElement = prevRenderedElement as ReactElement
      const nextElement = nextRenderedElement as ReactElement

      // 如果渲染的元素类型相同，更新子组件（重用 DOM）
      if (prevElement.type === nextElement.type) {
        prevRenderedInstance.receiveComponent(nextElement)
        callback?.()
        return
      }
    }

    // 类型不同，需要卸载旧实例并挂载新实例
    const prevNode = prevRenderedInstance?.getHostNode()

    // 卸载旧实例
    prevRenderedInstance?.unmountComponent()

    // 创建新实例并挂载
    const nextRenderedInstance = instantiateReactComponent(nextRenderedElement)
    const nextNode = nextRenderedInstance.mountComponent()
    this._renderedInstance = nextRenderedInstance

    // 将旧节点替换为新节点
    // 注意：这是 renderer 特定的代码，理想情况下应位于 CompositeComponent 之外
    // 如果父组件是 DOMComponent，它会通过 _updateChildren 完全卸载和重新挂载
    // 如果父组件是 CompositeComponent，我们需要自己处理 DOM 替换
    if (prevNode && prevNode.parentNode) {
      prevNode.parentNode.replaceChild(nextNode, prevNode)
    }

    // 调用回调
    callback?.()
  }

  /**
   * 卸载组件 - 递归卸载子组件
   */
  unmountComponent(): void {
    this._publicInstance?.componentWillUnmount?.()
    this._renderedInstance?.unmountComponent()
    this._publicInstance = null
    this._renderedInstance = null
  }

  /**
   * 获取公共实例
   */
  getPublicInstance(): any {
    return this._publicInstance
  }

  /**
   * 获取 DOM 节点 - 返回渲染实例的 hostNode
   */
  getHostNode(): Node | null {
    return this._renderedInstance?.getHostNode() || null
  }
}

function isClassComponent(Component: any): boolean {
  return !!(Component.prototype && Component.prototype.isReactComponent)
}
