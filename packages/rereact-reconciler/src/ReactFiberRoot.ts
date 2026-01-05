import type { Container, Fiber, FiberRoot } from './types'
import { createHostRootFiber } from './ReactFiber'

class FiberRootNode {
  containerInfo: Container
  current: Fiber | null

  constructor(containerInfo: Container) {
    this.containerInfo = containerInfo
    this.current = null
  }
}

export function createFiberRoot(containerInfo: Container): FiberRoot {
  const root: FiberRoot = new FiberRootNode(containerInfo)

  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber()
  root.current = uninitializedFiber
  uninitializedFiber.stateNode = root

  return root
}
