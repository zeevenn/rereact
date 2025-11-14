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
  onSwitchMode: () => void
}> {
  componentWillMount() {
    console.log('StackCounter componentWillMount', this.props)
  }

  componentWillUpdate(nextProps: any) {
    console.log('StackCounter componentWillUpdate', this.props, nextProps)
  }

  render() {
    const { count, onIncrement, onSwitchMode } = this.props

    return (
      <div className="card">
        <button onClick={onIncrement}>
          count is
          {' '}
          {count}
        </button>
        <button
          onClick={onSwitchMode}
          style={{ marginLeft: '10px' }}
        >
          Switch to List Mode
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

class StackList extends React.Component<{ onSwitchMode: () => void }> {
  render() {
    return (
      <div className="card">
        <button onClick={this.props.onSwitchMode}>
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
}

interface StackAppState {
  count: number
  mode: 'counter' | 'list'
}

export default class StackApp extends React.Component<object, StackAppState> {
  constructor(props: object) {
    super(props)
    this.state = {
      count: 0,
      mode: 'counter',
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

  handleSwitchToList = () => {
    this.setState({ mode: 'list' })
  }

  handleSwitchToCounter = () => {
    this.setState({ mode: 'counter' })
  }

  render() {
    const { count, mode } = this.state

    return (
      <div>
        <StackHeader />

        {mode === 'counter'
          ? (
              <StackCounter
                count={count}
                onIncrement={this.handleIncrement}
                onSwitchMode={this.handleSwitchToList}
              />
            )
          : <StackList onSwitchMode={this.handleSwitchToCounter} />}

        <p className="read-the-docs">
          Testing diff algorithm and component updates in Stack Reconciler
        </p>
      </div>
    )
  }
}
