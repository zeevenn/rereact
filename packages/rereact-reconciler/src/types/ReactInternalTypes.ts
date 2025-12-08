import type { WorkTag } from './ReactWorkTags'

// https://github.com/acdlite/react-fiber-architecture?tab=readme-ov-file#structure-of-a-fiber
// Fiber 是一个包含组件信息的对象，它对应一个栈帧，但同时也对应一个组件的实例。

// Fiber 是 React 对组件渲染工作的抽象，每个组件可能对应多个 Fiber，用于描述当前和即将完成的工作状态。
export interface Fiber {
  // 第一组字段是实例成员

  // An Instance is shared between all versions of a component. We can easily
  // break this out into a separate object to avoid copying so much to the
  // alternate versions of the tree. We put this on a single object for now to
  // minimize the number of objects created during the initial render.

  // Tag identifying the type of fiber.
  tag: WorkTag

  // Unique identifier of this child.
  key: string | null

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any

  // The resolved function/class/ associated with this fiber.
  type: any

  // The local state associated with this fiber.
  stateNode: any
}
