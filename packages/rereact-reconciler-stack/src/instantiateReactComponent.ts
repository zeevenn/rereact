import type { ReactElement, ReactNode } from 'shared'

export function instantiateReactComponent(node: ReactNode): any {
  const instance = null

  if (node === null || node === false) {
    // 空节点
    // instance = ReactEmptyComponent.create(instantiateReactComponent);
  }
  else if (typeof node === 'object') {
    const element = node as ReactElement
    if (typeof element.type === 'string') {
      // 原生 DOM 元素，宿主组件
      // instance = ReactHostComponent.createInternalComponent(element)
    }
    else {
      // 用户自定义组件，复合组件
      // instance = new ReactCompositeComponentWrapper(element)
    }
  }
  else if (typeof node === 'string' || typeof node === 'number') {
    // 文本节点
    // instance = ReactHostComponent.createInstanceForText(node)
  }
  else {
    throw new TypeError(`Encountered invalid React node of type ${typeof node}`)
  }

  return instance
}
