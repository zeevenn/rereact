import type { RefObject } from 'shared'
import type { Flags } from './ReactFiberFlags'
import type { Lanes } from './ReactFiberLane'
import type { WorkTag } from './ReactWorkTags'

// https://github.com/acdlite/react-fiber-architecture?tab=readme-ov-file#structure-of-a-fiber
// Fiber 是一个包含组件信息的对象，它对应一个栈帧，但同时也对应一个组件的实例。
// Fiber 是 React 对组件渲染工作的抽象，每个组件可能对应多个 Fiber，用于描述当前和即将完成的工作状态。
export interface Fiber {
  // These first fields are conceptually members of an Instance. This used to
  // be split into a separate type and intersected with the other Fiber fields,
  // but until Flow fixes its intersection bugs, we've merged them into a
  // single type.

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

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  return: Fiber | null

  // Singly Linked List Tree Structure.
  child: Fiber | null
  sibling: Fiber | null
  index: number

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref:
    | null
    | (((handle: any) => void) & { _stringRef: string | null })
    | RefObject

  refCleanup: null | (() => void)

  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps: any // This type will be more specific once we overload the tag.
  memoizedProps: any // The props used to create the output.

  // A queue of state updates and callbacks.
  updateQueue: any

  // The state used to create the output
  memoizedState: any

  // TODO: implement this
  // Dependencies (contexts, events) for this fiber, if it has any
  // dependencies: Dependencies | null,

  // Bitfield that describes properties about the fiber and its subtree. E.g.
  // the ConcurrentMode flag indicates whether the subtree should be async-by-
  // default. When a fiber is created, it inherits the mode of its
  // parent. Additional flags can be set at creation time, but after that the
  // value should remain unchanged throughout the fiber's lifetime, particularly
  // before its child fibers are created.
  // TODO: implement this
  // mode: TypeOfMode,

  // Effect
  flags: Flags
  subtreeFlags: Flags
  deletions: Array<Fiber> | null

  lanes: Lanes
  childLanes: Lanes

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  alternate: Fiber | null

  // Conceptual aliases
  // workInProgress : Fiber ->  alternate The alternate used for reuse happens
  // to be the same as work in progress.
}

export interface FiberRoot {

}
