import React from 'react'
import './App.css'

/**
 * 测试子组件 diff 算法
 *
 * 测试场景：
 * - 移动：改变子元素顺序
 * - 插入：添加新元素
 * - 删除：移除元素
 */
interface StackAppState {
  step: number
}

export default class StackApp extends React.Component<object, StackAppState> {
  constructor(props: object) {
    super(props)
    this.state = {
      step: 0,
    }
  }

  componentWillMount() {
    console.log('StackApp componentWillMount')
  }

  handleNext = () => {
    this.setState(prevState => ({
      step: prevState.step + 1,
    }))
  }

  handleReset = () => {
    this.setState({ step: 0 })
  }

  render() {
    const { step } = this.state

    // 根据 step 渲染不同的子元素顺序，触发 diff 算法
    // step 0: [A, B, C] - 初始状态
    // step 1: [B, A, C] - 移动：A 和 B 交换位置
    // step 2: [B, A, C, D] - 插入：添加 D
    // step 3: [A, C, D] - 删除：移除 B
    // step 4: [D, A, C] - 移动：D 移到前面
    // step 5: [A, B, C] - 重置：回到初始状态

    let children: React.ReactElement[]

    if (step % 5 === 0) {
      // 初始状态：A, B, C
      children = [
        <div key="A">A</div>,
        <div key="B">B</div>,
        <div key="C">C</div>,
      ]
    }
    else if (step % 5 === 1) {
      // 移动：B, A, C (A 和 B 交换)
      children = [
        <div key="B">B</div>,
        <div key="A">A</div>,
        <div key="C">C</div>,
      ]
    }
    else if (step % 5 === 2) {
      // 插入：B, A, C, D (添加 D)
      children = [
        <div key="B">B</div>,
        <div key="A">A</div>,
        <div key="C">C</div>,
        <div key="D">D</div>,
      ]
    }
    else if (step % 5 === 3) {
      // 删除：A, C, D (移除 B)
      children = [
        <div key="A">A</div>,
        <div key="C">C</div>,
        <div key="D">D</div>,
      ]
    }
    else if (step % 5 === 4) {
      // 移动：D, A, C (D 移到前面)
      children = [
        <div key="D">D</div>,
        <div key="A">A</div>,
        <div key="C">C</div>,
      ]
    }
    else {
      // 重置：A, B, C
      children = [
        <div key="A">A</div>,
        <div key="B">B</div>,
        <div key="C">C</div>,
      ]
    }

    return (
      <div>
        <div>
          <button onClick={this.handleNext}>
            Next Step (当前:
            {step}
            )
          </button>
          <button onClick={this.handleReset} style={{ marginLeft: '10px' }}>Reset</button>
        </div>
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          {children}
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Step
          {' '}
          {step % 5}
          :
          {' '}
          {children.map(c => c.key).join(', ')}
        </div>
      </div>
    )
  }
}
