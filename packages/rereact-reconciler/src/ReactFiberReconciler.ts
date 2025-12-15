import type { ReactNodeList } from 'shared'
import type { FiberRoot } from './types/ReactInternalTypes'
import { createFiberRoot } from './ReactFiberRoot'

export function createContainer(containerInfo: any): any {
  return createFiberRoot(containerInfo)
}

export function updateContainer(children: ReactNodeList, root: FiberRoot): void {
  // TODO: Implement this
  console.warn('updateContainer', children, root)
}
