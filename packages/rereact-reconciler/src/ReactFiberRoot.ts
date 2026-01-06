import type { Container, Fiber, FiberRoot } from './types'
import { createHostRootFiber } from './ReactFiber'

class FiberRootNode {
  containerInfo: Container
  current: Fiber

  constructor(containerInfo: Container, hostRootFiber: Fiber) {
    this.containerInfo = containerInfo
    this.current = hostRootFiber
  }
}

export function createFiberRoot(containerInfo: Container): FiberRoot {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  const uninitializedFiber = createHostRootFiber()
  const root: FiberRoot = new FiberRootNode(containerInfo, uninitializedFiber)
  uninitializedFiber.stateNode = root

  return root
}
