# React 15 Stack Reconciler 示例

这个示例展示了 React 15.7.0（最后一个使用 Stack Reconciler 的版本）的行为特性。

## 🎯 目的

通过真实的 React 15 环境，观察和学习 Stack Reconciler 的工作原理，特别是：

- **空节点处理**：React 15 会为 `null`、`undefined`、`false`、`true` 等空值插入注释节点占位符
- **类组件**：React 15 时代的标准写法（Hooks 是 16.8+ 才有的）
- **渲染 API**：使用 `ReactDOM.render()` 而不是现代的 `createRoot()`

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm example:stack dev
```

## 🔍 观察 Stack Reconciler 的特性

启动项目后，打开浏览器开发者工具的 **Elements** 面板，你会看到：

```html
<div>null: <!--react-empty: 1--></div>
<div>undefined: <!--react-empty: 2--></div>
<div>false: <!--react-empty: 3--></div>
<div>true: <!--react-empty: 4--></div>
```

### 为什么有注释节点？

在 React 15 的 Stack Reconciler 中，这些注释节点用于：
1. **位置追踪**：标记空节点在 DOM 树中的位置
2. **更新优化**：方便后续更新时找到插入点
3. **Diff 算法**：帮助 reconciler 进行节点对比

### React 版本对比

| React 版本 | Reconciler | 空节点处理 |
|-----------|-----------|-----------|
| **15.x** | Stack | ✅ 插入注释节点 `<!--react-empty: X-->` |
| **16.x - 18.x** | Fiber | 🔄 逐步移除注释节点 |
| **19.x** | Fiber | ❌ 完全不插入注释节点 |

## 📚 学习资源

- [React 15 文档](https://5.reactjs.org/)
- [Stack Reconciler 源码](https://github.com/facebook/react/tree/15-stable/src/renderers)
- [React Fiber 架构](https://github.com/acdlite/react-fiber-architecture)

## 🔗 相关项目

- `rereact-reconciler-stack`: 我们自己实现的 Stack Reconciler
- `examples/fiber`: React 19 (Fiber Reconciler) 对比示例
