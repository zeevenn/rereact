import type { ReactElement, ReactNode } from 'shared'

export interface InternalInstance {
  currentElement: ReactElement | null | string | number
  _mountIndex?: number | null

  mountComponent: () => Node
  receiveComponent: (nextElement: ReactNode) => void
  unmountComponent: () => void

  getPublicInstance: () => any
  getHostNode: () => Node | null
}
