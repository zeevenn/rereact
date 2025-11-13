import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'

/**
 * 函数组件示例 - 用于测试 Stack Reconciler 的函数组件支持
 * 注意：Stack Reconciler 只支持 stateless 函数组件，不支持 hooks
 */
function StackHeader() {
  console.log('StackHeader')

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React (Stack Reconciler)</h1>
    </div>
  )
}

class StackCounter extends React.Component<{ count: number }> {
  componentWillMount() {
    console.log('StackCounter componentWillMount', this.props)
  }

  componentWillUpdate(nextProps: any) {
    console.log('StackCounter componentWillUpdate', this.props, nextProps)
  }

  render() {
    const { count } = this.props

    return (
      <div className="card">
        <button id="increment-btn">
          count is {count}
        </button>
        <button id="switch-mode-btn" style={{ marginLeft: '10px' }}>
          Switch to List Mode
        </button>
        <p>
          This demonstrates <strong>diff algorithm</strong> in Stack Reconciler
        </p>
        <p>
          Click the button to update the counter. The DOM nodes are reused, not recreated!
        </p>
        <p>
          Open DevTools console to see lifecycle methods being called.
        </p>
      </div>
    )
  }
}

function StackList() {
  return (
    <div className="card">
      <button id="switch-mode-btn">
        Switch to Counter Mode
      </button>
      <ul style={{ marginTop: '20px' }}>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <p>
        This demonstrates switching between different component structures.
      </p>
      <p>
        The diff algorithm will unmount and remount when structure changes.
      </p>
    </div>
  )
}

export default class StackApp extends React.Component {
  componentWillMount() {
    console.log('StackApp componentWillMount')
  }

  componentWillUpdate(nextProps: any) {
    console.log('StackApp componentWillUpdate', nextProps)
  }

  render() {
    // 从全局状态读取（模拟 setState）
    // 注意：我们的 Stack Reconciler 还没有实现 setState，所以使用全局状态
    const state = (window as any).__stackAppState || { count: 0, mode: 'counter' }
    const { count, mode } = state

    return (
      <div>
        <StackHeader />

        {mode === 'counter' ? <StackCounter count={count} /> : <StackList />}

        <p className="read-the-docs">
          Testing diff algorithm and component updates in Stack Reconciler
        </p>
      </div>
    )
  }
}
