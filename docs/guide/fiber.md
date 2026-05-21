# Fiber

## 什么是 Fiber

Fiber 是 React 对组件渲染工作的抽象。每个 Fiber 节点对应一个组件实例或 DOM 元素，通过链表结构（`child` / `sibling` / `return`）组织成树。

## 核心数据结构

```ts
interface Fiber {
  tag: WorkTag        // 节点类型 (FunctionComponent, HostComponent, HostRoot...)
  key: ReactKey
  type: any           // 组件函数/类，或 DOM 标签名
  stateNode: any      // 对应的真实 DOM 节点或组件实例

  // 树结构 (链表)
  return: Fiber | null   // 父节点
  child: Fiber | null    // 第一个子节点
  sibling: Fiber | null  // 下一个兄弟节点

  // 工作状态
  pendingProps: any
  memoizedProps: any
  memoizedState: any
  updateQueue: any

  // 副作用
  flags: Flags
  subtreeFlags: Flags

  // 双缓冲
  alternate: Fiber | null
}
```

## FiberRoot 与 HostRootFiber

```
createRoot(container)
    │
    ▼
┌─────────────┐     current     ┌──────────────────┐
│ FiberRoot   │ ──────────────► │ HostRootFiber    │
│ (容器信息)   │ ◄────────────── │ (tag: HostRoot)  │
└─────────────┘    stateNode    └──────────────────┘
```

双向引用确保从任一方向都能遍历到另一方。
