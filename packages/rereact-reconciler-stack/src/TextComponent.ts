/**
 * 文本组件 - 用于渲染字符串和数字
 * 使用注释节点包裹文本节点，以便进行 reconciliation
 *
 * 参考 React 源码：ReactDOMTextComponent
 * 文本节点违反了一些 React 的假设：
 * - 挂载到 DOM 时，相邻的文本节点会被合并
 * - 文本节点不能分配 React root ID
 *
 * 因此使用注释节点包裹文本节点，使其能够进行 reconciliation
 */

import type { ReactNode } from 'shared'
import type { InternalInstance } from './types/ReactInstance'

let textIdCounter = 0

export class TextComponent implements InternalInstance {
  private _currentElement: string | number
  private _stringText: string
  private _hostNode: Text | null = null
  private _openingComment: Comment | null = null
  private _closingComment: Comment | null = null
  private _domID: number

  constructor(text: string | number) {
    this._currentElement = text
    this._stringText = String(text)
    this._domID = ++textIdCounter
  }

  /**
   * 挂载组件 - 创建注释节点包裹的文本节点
   */
  mountComponent(): DocumentFragment {
    // 创建文档片段，包含：开始注释 + 文本节点 + 结束注释
    const fragment = document.createDocumentFragment()

    // 创建开始注释节点
    const openingComment = document.createComment(` react-text: ${this._domID} `)
    this._openingComment = openingComment
    fragment.appendChild(openingComment)

    // 创建文本节点
    if (this._stringText) {
      const textNode = document.createTextNode(this._stringText)
      this._hostNode = textNode
      fragment.appendChild(textNode)
    }

    // 创建结束注释节点
    const closingComment = document.createComment(` /react-text `)
    this._closingComment = closingComment
    fragment.appendChild(closingComment)

    return fragment
  }

  /**
   * 更新组件 - 更新文本内容
   */
  receiveComponent(nextElement: ReactNode): void {
    // TextComponent 只接受 string 或 number
    if (typeof nextElement !== 'string' && typeof nextElement !== 'number') {
      throw new TypeError('TextComponent.receiveComponent expects string or number')
    }

    const nextText = nextElement
    if (nextText !== this._currentElement) {
      this._currentElement = nextText
      const nextStringText = String(nextText)

      // 如果文本内容变化，更新文本节点
      if (nextStringText !== this._stringText && this._hostNode) {
        this._stringText = nextStringText
        this._hostNode.textContent = nextStringText
      }
    }
  }

  /**
   * 卸载组件 - 清理引用
   */
  unmountComponent(): void {
    this._hostNode = null
    this._openingComment = null
    this._closingComment = null
  }

  /**
   * 获取公共实例 - 文本组件返回文本内容
   */
  getPublicInstance(): string {
    return this._stringText
  }

  /**
   * 获取 DOM 节点 - 返回文本节点
   * 注意：React 源码返回 [openingComment, closingComment] 数组
   * 这里简化返回文本节点本身
   */
  getHostNode(): Text | null {
    return this._hostNode
  }
}
