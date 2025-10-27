import { REACT_FRAGMENT_TYPE } from 'shared'
import { jsx as _jsx } from './ReactJSXElement'

// jsx 和 jsxs 在运行时逻辑相同
// jsxs 是编译器对静态子元素的优化标记，但是在这里实现相同
export { _jsx as jsx, _jsx as jsxDEV, _jsx as jsxs }
export { REACT_FRAGMENT_TYPE as Fragment }
