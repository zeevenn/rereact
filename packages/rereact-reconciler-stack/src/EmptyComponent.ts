/**
 * 空组件 - 用于渲染 null、false
 * 在 DOM 中创建一个注释节点作为占位符
 */

import type { InternalInstance } from './types/ReactInstance'

let emptyIdCounter = 0

export class EmptyComponent implements InternalInstance {
  private _hostNode: Comment | null = null
  private _id: number
  private _currentElement = null

  constructor() {
    this._id = ++emptyIdCounter
  }

  /**
   * 挂载组件 - 创建注释节点
   */
  mountComponent(): Comment {
    const node = document.createComment(`rereact-empty: ${this._id}`)
    this._hostNode = node
    return node
  }

  /**
   * 更新组件 - 空组件不需要更新
   */
  receiveComponent(): void {
    // 空组件永远是空的，不需要任何操作
  }

  /**
   * 卸载组件 - 清理引用
   */
  unmountComponent(): void {
    this._hostNode = null
  }

  /**
   * 获取公共实例 - 空组件返回 null
   */
  getPublicInstance(): null {
    return null
  }

  /**
   * 获取 DOM 节点
   */
  getHostNode(): Comment | null {
    return this._hostNode
  }
}
