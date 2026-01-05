import type { ReactNodeList } from 'shared'
import type { Container, FiberRoot } from './types'
import { createFiberRoot } from './ReactFiberRoot'

export function createContainer(containerInfo: Container): FiberRoot {
  return createFiberRoot(containerInfo)
}

export function updateContainer(children: ReactNodeList, root: FiberRoot): void {
  // TODO: Implement this
  console.warn('updateContainer', children, root)
}
