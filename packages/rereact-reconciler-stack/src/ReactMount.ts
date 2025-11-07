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
export function render(element: ReactElement, container: DOMElement): void {
  const componentInstance = instantiateReactComponent(element)

  container.appendChild(componentInstance.dom)

  return componentInstance
}
