import type { FiberRoot } from 'rereact-reconciler'
import type { ReactNodeList } from 'shared'
import { createContainer, updateContainer } from 'rereact-reconciler'

export interface RootType {
  render: (children: ReactNodeList) => void
  unmount: () => void
  _internalRoot: FiberRoot | null
}

class ReactDOMRoot implements RootType {
  _internalRoot: FiberRoot | null

  constructor(internalRoot: FiberRoot) {
    this._internalRoot = internalRoot
  }

  render(children: ReactNodeList): void {
    const root = this._internalRoot
    if (root !== null) {
      updateContainer(children, root)
    }
  }

  unmount(): void {
    const root = this._internalRoot
    if (root !== null) {
      this._internalRoot = null
      updateContainer(null, root)
    }
  }
}

export function createRoot(container: Element | Document | DocumentFragment): RootType {
  const root = createContainer(container)
  return new ReactDOMRoot(root)
}
