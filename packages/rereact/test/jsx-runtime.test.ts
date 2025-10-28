import { describe, expect, it } from 'vitest'
import { jsx } from '../src/jsx-runtime'

describe('jsx runtime', () => {
  it('should remove key and ref from props', () => {
    const element = jsx('div', { className: 'foo', key: 'bar' })
    expect(element.props.key).toBeUndefined()
    expect(element.props.ref).toBeUndefined()
  })

  it('should set ref to null if not provided', () => {
    const element1 = jsx('div', { className: 'foo', ref: undefined })
    const element2 = jsx('div', { className: 'foo' })
    expect(element1.ref).toBeNull()
    expect(element2.ref).toBeNull()
  })
})
