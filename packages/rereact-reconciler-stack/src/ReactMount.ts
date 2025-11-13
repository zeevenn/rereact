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
  if (container.firstChild) {
    unmount(container)
  }

  // 1. 创建内部实例
  const rootInstance = instantiateReactComponent(element)

  // 2. 挂载组件
  const node = rootInstance.mountComponent()
  container.appendChild(node)
  // 保存对内部实例的引用
  node._internalInstance = rootInstance

  // 3. 返回公共实例（用户定义组件）
  return rootInstance.getPublicInstance()
}

/**
 * 卸载组件
 * @param container - DOM 容器
 */
function unmount(container: DOMElement): void {
  const firstChild = container.firstChild
  if (firstChild) {
    const rootInstance = firstChild._internalInstance
    if (rootInstance) {
      rootInstance.unmountComponent()
    }
    container.replaceChildren()
  }
}
