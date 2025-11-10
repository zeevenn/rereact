import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/**
 * 函数组件示例 - 用于测试 Stack Reconciler 的函数组件支持
 * 注意：Stack Reconciler 只支持 stateless 函数组件，不支持 hooks
 */
function StackApp() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React (Stack Reconciler)</h1>
      <div className="card">
        <button>
          count is 0
        </button>
        <p>
          This is a <strong>stateless function component</strong> using Stack Reconciler
        </p>
        <p>
          Edit <code>src/StackApp.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Testing function component support in Stack Reconciler
      </p>
    </>
  )
}

export default StackApp

