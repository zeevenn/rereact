import React from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import viteLogo from '/vite.svg'

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

class StackCounter extends React.Component<{
  count: number
  onIncrement: () => void
}> {
  componentWillMount() {
    console.log('StackCounter componentWillMount', this.props)
  }

  componentWillUpdate(nextProps: any) {
    console.log('StackCounter componentWillUpdate', this.props, nextProps)
  }

  render() {
    const { count, onIncrement } = this.props

    return (
      <div className="card">
        <button onClick={onIncrement}>
          count is
          {' '}
          {count}
        </button>
        <p>
          This demonstrates
          {' '}
          <strong>diff algorithm</strong>
          {' '}
          in Stack Reconciler
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

interface StackAppState {
  count: number
}

export default class StackApp extends React.Component<object, StackAppState> {
  constructor(props: object) {
    super(props)
    this.state = {
      count: 0,
    }
  }

  componentWillMount() {
    console.log('StackApp componentWillMount')
  }

  componentWillUpdate(nextProps: any) {
    console.log('StackApp componentWillUpdate', nextProps)
  }

  handleIncrement = () => {
    this.setState(prevState => ({
      ...prevState,
      count: prevState.count + 1,
    }))
  }

  render() {
    const { count } = this.state

    return (
      <div>
        <StackHeader />

        <StackCounter
          count={count}
          onIncrement={this.handleIncrement}
        />

        <p className="read-the-docs">
          Testing diff algorithm and component updates in Stack Reconciler
        </p>
      </div>
    )
  }
}
