// import { createRoot } from 'react-dom/client'
import { render } from 'rereact-reconciler-stack'
import StackApp from './StackApp.tsx'
import './index.css'
// import { StrictMode } from 'react'
// import App from './App.tsx'

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
// 全局状态（用于模拟 setState，因为我们的 Stack Reconciler 还没有实现 setState）
// 使用 window 对象存储状态，方便在组件中访问
;(window as any).__stackAppState = {
  count: 0,
  mode: 'counter' as 'counter' | 'list',
}

const container = document.getElementById('root')!

// 初始渲染
render(
  <StackApp />,
  container,
)

// 模拟 setState：更新全局状态，然后手动调用 render() 触发更新
// 注意：虽然每次都会调用 render()，但我们的 diff 算法会重用组件实例
// 只有变化的部分才会更新 DOM
function updateApp() {
  render(
    <StackApp />,
    container,
  )
}

// 使用事件委托，在容器上监听点击事件
// 这样即使 DOM 更新，事件监听器也不会丢失
container.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  
  if (target.id === 'increment-btn') {
    ;(window as any).__stackAppState.count++
    console.log('Counter updated:', (window as any).__stackAppState.count)
    updateApp()
  }
  else if (target.id === 'switch-mode-btn') {
    const state = (window as any).__stackAppState
    state.mode = state.mode === 'counter' ? 'list' : 'counter'
    console.log('Mode switched:', state.mode)
    updateApp()
  }
})
