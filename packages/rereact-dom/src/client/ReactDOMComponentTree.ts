import type { Container, Fiber } from 'rereact-reconciler'

const randomKey = Math.random().toString(36).slice(2)
const internalContainerInstanceKey = `__reactContainer$${randomKey}`

export function markContainerAsRoot(hostRoot: Fiber, node: Container): void {
  (node as any)[internalContainerInstanceKey] = hostRoot
}
