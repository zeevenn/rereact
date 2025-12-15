import { createRoot } from 'rereact-dom/client'
import App from './App.tsx'

// 取消注释，使用 Stack Reconciler 查看效果
// import { render } from 'rereact-reconciler-stack'
// import StackApp from './StackApp.tsx'

import './index.css'

// Fiber Reconciler
createRoot(document.getElementById('root')!).render(
  <App />,
)

// Fiber Reconciler - 函数组件示例
// createRoot(document.getElementById('root')!).render(
//   <StackApp />,
// )

// Stack Reconciler
// const container = document.getElementById('root')!

// render(
//   <StackApp />,
//   container,
// )
