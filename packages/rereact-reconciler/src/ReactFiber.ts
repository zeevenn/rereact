import type { ReactKey, RefObject } from 'shared'
import type { Dependencies, Fiber, Flags, Lanes, WorkTag } from './types'
import { HostRoot, NoFlags, NoLanes } from './types'

class FiberNode implements Fiber {
  // Instance
  tag: WorkTag
  key: ReactKey
  elementType: any = null
  type: any = null
  stateNode: any = null

  // Fiber
  return: Fiber | null = null
  child: Fiber | null = null
  sibling: Fiber | null = null
  index: number = 0

  ref: RefObject | null = null
  refCleanup: (() => void) | null = null

  pendingProps: any
  memoizedProps: any = null
  updateQueue: any = null
  memoizedState: any = null
  dependencies: Dependencies | null = null

  // Effects
  flags: Flags = NoFlags
  subtreeFlags: Flags = NoFlags
  deletions: Array<Fiber> | null = null

  lanes: Lanes = NoLanes
  childLanes: Lanes = NoLanes

  alternate: Fiber | null = null

  constructor(tag: WorkTag, pendingProps: unknown, key: ReactKey) {
    this.tag = tag
    this.key = key
    this.pendingProps = pendingProps
  }
}

function createFiber(tag: WorkTag, pendingProps: unknown, key: ReactKey): Fiber {
  return new FiberNode(tag, pendingProps, key)
}

export function createHostRootFiber(): Fiber {
  return createFiber(HostRoot, null, null)
}
