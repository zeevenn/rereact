# React 15 Stack Reconciler 示例

这个示例展示了 React 15.6.2（15-stable）中 Stack Reconciler 的版本的行为特性。

## 🎯 目的

通过真实的 React 15 环境，观察和学习 Stack Reconciler 的工作原理，特别是：

- **React.createElement**: jsx-runtime 使用经典 JSX transform
- **渲染 API**：使用 `ReactDOM.render()` 而不是现代的 `createRoot()`

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm example:stack dev
```

## 📚 学习资源

- [Stack Reconciler 实现说明](https://zh-hans.legacy.reactjs.org/docs/implementation-notes.html)
- [Stack Reconciler 源码](https://github.com/facebook/react/tree/15-stable/src/renderers)

## 🔗 相关项目

- `rereact-reconciler-stack`: 我们自己实现的 Stack Reconciler
- `examples/fiber`: React 19 (Fiber Reconciler) 对比示例
