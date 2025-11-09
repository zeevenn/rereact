export type FunctionComponent = (props: any) => any

/**
 * React 元素类型定义
 */
export interface ReactElement {
  /** 元素标识符，用于区分真实的 React 元素 */
  $$typeof: symbol

  /**
   * 元素类型：
   * - string: 原生 DOM 元素（'div', 'span' 等）
   * - FunctionComponent: 函数组件
   * - symbol: 特殊内置组件（Fragment, Portal, Suspense 等）
   */
  type: string | FunctionComponent | symbol

  key?: string | null

  ref?: string | null

  props: Record<string, any>
}
