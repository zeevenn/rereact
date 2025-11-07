import type { ReactElement } from './ReactElementType'

// export type ReactNode = ReactElement | ReactFragment | ReactText | ReactPortal | ReactNull

export type ReactNode = | ReactElement | ReactText | ReactFragment

export type ReactFragment = ReactEmpty | Iterable<ReactNode>

export type ReactNodeList = ReactEmpty | ReactNode

export type ReactText = string | number

export type ReactEmpty = null | void | boolean
