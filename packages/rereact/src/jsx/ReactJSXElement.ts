import type { ReactElement } from 'shared'
import { REACT_ELEMENT_TYPE } from 'shared'

/**
 * 简化版的 jsx 函数
 * @param type - 元素类型（如 'div' 或组件）
 * @param config - 包含所有属性的配置对象
 * @param maybeKey - 可选的 key 参数（babel 解析的 key）
 */
export function jsx(type: any, config: any, maybeKey?: string): ReactElement {
  let key = null

  // 1. 处理 key：优先使用 maybeKey 参数
  if (maybeKey !== undefined) {
    key = `${maybeKey}`
  }

  // 2. 如果 maybeKey 没传，从 config 中获取
  if (key === null && config?.key !== undefined) {
    key = String(config.key)
  }

  // 3. 处理 props：复制除 key 之外的所有属性到 props
  // 这里是为了阻止 key 的 spread 赋值，若不排除，组件则可以调用 props.key
  // jsxDEV 中会对 key 为 props 的情况进行告警：
  // https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L504-L528
  // example: https://babeljs.io/repl#?config_lz=N4IgZglgNgpgdgQwLYxALhAJxgBygOgCsBnADxABoQdtiYAXY9AbWZHgDdLR6FMBzBkwwATGGAQBXKIwoACOAHt6ciDDkBGDfKUq1AfSSKARpo2UQRkdJjCJUOlWOT-kUrfT1MkmAF8AuhRs2AgAxvTcWJJw9BAo6CBS9IpICLGhIAFBIMS8ggC05hSgYqGKmGnlxABqMJjEEIpwCQBMAAwtAMyFRdQQODBQEHAwAAqYijiKxAhQCQAWYQDWmf6BOYqSmKEwACoAngMJVjaZQA&code_lz=KYDwDg9gTgLgBAMwK4DsDGMCWEVwMphTACGAJgNLACeAFAJRwDeAUHG3GjgM7yERhc4AXiZwA1tQBccAOQSqMuAF8A3K3ZEYSKLhrr27ADylMANyYA6K3wFKAfPoNOAKgAtMgj3C6ESpcdSOBoYA9CamDgZ0zEpAA&lineWrap=true&version=7.28.5
  let props: any = {}

  if (!('key' in config)) {
    props = config
  }
  else {
    // 复制除 key 之外的所有属性到 props
    for (const propName in config) {
      if (propName !== 'key') {
        props[propName] = config[propName]
      }
    }
  }

  return reactElement(type, key, props)
}

function reactElement(type: any, key: string | null, props: any): ReactElement {
  // 处理 ref 属性，无值时统一设置为 null
  // React 19, ref 可以作为普通 props 传入，不再需要 forwardRef
  // https://react.dev/reference/react/forwardRef
  const ref = props.ref !== undefined ? props.ref : null

  // 开发环境中，react 会对 ref 进行告警，并冻结 props 和 返回的 element 对象
  // https://github.com/facebook/react/blob/main/packages/react/src/jsx/ReactJSXElement.js#L200-L279

  return {
    $$typeof: REACT_ELEMENT_TYPE,

    type,
    key,
    ref,

    props,
  }
}
