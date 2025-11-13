import type { ClassComponent, FunctionComponent, ReactElement, ReactNode } from 'shared'
import type { InternalInstance } from './types/ReactInstance'
import { instantiateReactComponent } from './instantiateReactComponent'

/**
 * 复合组件 - 用于渲染用户自定义的函数组件或类组件
 * 函数组件返回的元素会被递归处理，直到得到 DOM 节点
 */
export class CompositeComponent implements InternalInstance {
  private _publicInstance: any | null = null
  private _currentElement: ReactElement
  private _renderedElement: ReactNode | null = null
  private _renderedInstance: InternalInstance | null = null

  constructor(element: ReactElement) {
    this._currentElement = element
  }

  /**
   * 挂载组件 - 调用函数组件并递归挂载渲染的元素
   */
  mountComponent(): Node {
    const { type, props } = this._currentElement

    let publicInstance: any | null = null
    let renderedElement: ReactNode | null = null
    if (isClassComponent(type)) {
      // 实例化组件类
      publicInstance = new (type as ClassComponent)(props)
      publicInstance.props = props

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

    const nextElementTyped = nextElement as ReactElement
    this._currentElement = nextElementTyped

    const { type, props } = nextElementTyped
    const FunctionComponent = type as FunctionComponent

    // 重新调用函数组件获取新的渲染元素
    const nextRenderedElement = FunctionComponent(props)
    const prevRenderedElement = this._renderedElement

    // 如果组件类型没有变化，尝试更新子组件
    if (
      prevRenderedElement != null
      && nextRenderedElement != null
      && typeof prevRenderedElement === 'object'
      && typeof nextRenderedElement === 'object'
      && this._renderedInstance
    ) {
      const prevElement = prevRenderedElement as ReactElement
      const nextElement = nextRenderedElement as ReactElement

      // 如果渲染的元素类型相同，更新子组件（重用 DOM）
      if (prevElement.type === nextElement.type) {
        this._renderedElement = nextRenderedElement
        this._renderedInstance.receiveComponent(nextElement)
        return
      }
    }

    // 类型不同，需要卸载旧实例并挂载新实例
    // 注意：DOM 替换由父组件通过 _updateChildren 处理
    if (this._renderedInstance) {
      this._renderedInstance.unmountComponent()
    }

    // 创建新实例并挂载
    this._renderedElement = nextRenderedElement
    const renderedInstance = instantiateReactComponent(nextRenderedElement)
    this._renderedInstance = renderedInstance

    // 挂载新实例（DOM 节点会被父组件处理）
    renderedInstance.mountComponent()
  }

  /**
   * 卸载组件 - 递归卸载子组件
   */
  unmountComponent(): void {
    this._publicInstance?.componentWillUnmount?.()
    this._renderedInstance?.unmountComponent()
    this._publicInstance = null
    this._renderedElement = null
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
