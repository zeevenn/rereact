/// <reference lib="dom" />

import type { InternalInstance } from './src/types/ReactInstance'

declare global {
  interface Node {
    _internalInstance?: InternalInstance
  }
}
