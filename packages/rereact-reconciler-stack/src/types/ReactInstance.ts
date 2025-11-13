import type { ReactElement, ReactNode } from 'shared'

export interface InternalInstance {
  currentElement: ReactElement | null | string | number

  mountComponent: () => Node
  receiveComponent: (nextElement: ReactNode) => void
  unmountComponent: () => void

  getPublicInstance: () => any
  getHostNode: () => Node | null
}
