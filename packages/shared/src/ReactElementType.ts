export interface ReactElement {
  $$typeof: symbol
  type: string
  key: string | null
  ref: string | null
  props: Record<string, any>
}
