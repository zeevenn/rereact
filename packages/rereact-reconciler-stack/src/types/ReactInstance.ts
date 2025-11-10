import type { ReactNode } from 'shared'

export interface InternalInstance {
  mountComponent: () => Node
  receiveComponent: (nextElement: ReactNode) => void
  unmountComponent: () => void

  getPublicInstance: () => any
  getHostNode: () => Node | null
}
