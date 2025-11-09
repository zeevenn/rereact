import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface AppState {
  count: number
  showEmpty: boolean
}

// React 15 Stack Reconciler 演示 - 使用类组件
class App extends React.Component<{}, AppState> {
  state: AppState = {
    count: 0,
    showEmpty: true,
  }

  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 })
  }

  handleToggleEmpty = () => {
    this.setState({ showEmpty: !this.state.showEmpty })
  }

  render() {
    const { count, showEmpty } = this.state

    // 取消注释下一行查看 `<!-- react-empty: 1 -->` 注释节点
    return null

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
        
        <h1>React 15.7.0 - Stack Reconciler</h1>
        
        <div className="card">
          <button onClick={this.handleIncrement}>
            count is {count}
          </button>
          
          <div style={{ marginTop: 20, padding: 20, textAlign: 'left', border: '1px solid #646cff', borderRadius: 8 }}>
            <h3 style={{ marginTop: 0 }}>🔍 Stack Reconciler 特性演示</h3>
            
            <button 
              onClick={this.handleToggleEmpty}
              style={{ marginBottom: 10 }}
            >
              切换空节点显示
            </button>
            
            <div style={{ 
              padding: 15, 
              background: '#1a1a1a', 
              borderRadius: 4,
              fontFamily: 'monospace',
              fontSize: 14
            }}>
              <div>null: {null}</div>
              <div>undefined: {undefined}</div>
              <div>false: {false}</div>
              <div>true: {true}</div>
              <div>
                条件渲染: {showEmpty ? <span>显示</span> : null}
              </div>
            </div>
            
            <p style={{ fontSize: 12, color: '#888', marginBottom: 0 }}>
              💡 提示：打开浏览器开发者工具，查看 Elements 面板
              <br />
              React 15 会为空节点插入注释占位符：
              <code style={{ color: '#646cff' }}> &lt;!--react-empty: X--&gt;</code>
            </p>
          </div>
        </div>
        
        <p className="read-the-docs">
          观察 React 15 Stack Reconciler 如何处理空节点
        </p>
      </div>
    )
  }
}

export default App
