import type { ReactElement, ReactNode } from 'shared'
import type { InternalInstance } from './types/ReactInstance'
import { DOMComponent } from './DOMComponent'
import { EmptyComponent } from './EmptyComponent'

export function instantiateReactComponent(node: ReactNode): InternalInstance {
  // 空节点 ReactEmpty: null | undefined | boolean
  if (node == null || typeof node === 'boolean') {
    return new EmptyComponent()
  }

  // 文本节点 ReactText
  if (typeof node === 'string' || typeof node === 'number') {
    // TODO: 实现 TextComponent
    throw new TypeError('TextComponent not implemented yet')
  }

  // ReactElement
  if (typeof node === 'object') {
    const element = node as ReactElement
    if (typeof element.type === 'string') {
      // 原生 DOM 元素，宿主组件
      return new DOMComponent(element)
    }
    else if (typeof element.type === 'function') {
      // 用户自定义组件，复合组件
      // TODO: 实现 CompositeComponent
      throw new TypeError('CompositeComponent not implemented yet')
    }
    else if (typeof element.type === 'symbol') {
      // 特殊组件类型（Fragment, Portal 等）
      // TODO: 实现特殊组件
      throw new TypeError('Special component types not implemented yet')
    }
  }

  throw new TypeError(`Encountered invalid React node of type ${typeof node}`)
}
