// import { createRoot } from 'react-dom/client'
import { render } from 'rereact-reconciler-stack'
import StackApp from './StackApp.tsx'
import './index.css'
// import { StrictMode } from 'react'
// import App from './App.tsx'
// import { render } from 'rereact-reconciler-stack'

// Fiber Reconciler
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// Fiber Reconciler - 函数组件示例
// createRoot(document.getElementById('root')!).render(
//   <StackApp />,
// )

// Stack Reconciler
render(
  <StackApp />,
  document.getElementById('root')!,
)