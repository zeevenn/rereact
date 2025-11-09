import type { ReactElement } from 'shared'
import { instantiateReactComponent } from './instantiateReactComponent'

export type DOMElement = Element | DocumentFragment

/**
 * 渲染 React 元素到 DOM 容器
 * @param element - React 元素
 * @param container - DOM 容器
 * @example
 * ```tsx
 * render(<div>Hello, world!</div>, document.getElementById('root'))
 * ```
 */
export function render(element: ReactElement, container: DOMElement): any {
  // 1. 创建内部实例
  const rootInstance = instantiateReactComponent(element)

  // 2. 挂载组件
  const node = rootInstance.mountComponent()
  container.replaceChildren(node)

  // 3. 返回公共实例（用户定义组件）
  return rootInstance.getPublicInstance()
}
