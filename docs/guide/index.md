# Introduction

ReReact 是一个从零实现的 React，用于深入学习 React 内部原理。

## 项目结构

```
packages/
├── rereact/                  # React core (JSX, createElement)
├── rereact-dom/              # DOM renderer (createRoot)
├── rereact-reconciler/       # Fiber reconciler
├── rereact-reconciler-stack/ # Legacy stack reconciler (参考)
├── rereact-scheduler/        # Scheduler
└── shared/                   # Shared types & utils
```

## 实现路线

1. ~~JSX → ReactElement~~
2. ~~Stack Reconciler（旧架构参考）~~
3. **Fiber 数据结构** ← 当前进度
4. Update Queue
5. Work Loop (beginWork / completeWork)
6. Commit Phase
7. Hooks
