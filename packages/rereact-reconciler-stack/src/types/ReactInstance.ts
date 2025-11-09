import type { ReactElement } from 'shared'

export interface InternalInstance {
  mountComponent: () => Node
  receiveComponent: (nextElement: ReactElement) => void
  unmountComponent: () => void

  getPublicInstance: () => any
  getHostNode: () => Node | null
}
