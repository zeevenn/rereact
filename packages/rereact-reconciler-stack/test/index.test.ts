import { jsx } from 'rereact/jsx-runtime'
import { describe, expect, it } from 'vitest'
import { render } from '../src'

describe('stack Reconciler - DOM Component', () => {
  it('render nested elements', () => {
    const root = document.createElement('div')
    const element = jsx('div', {
      children: jsx('span', { children: null }),
    })
    render(element, root)
    expect(root.innerHTML).toBe('<div><span></span></div>')
  })

  it('render empty div', () => {
    const root = document.createElement('div')
    const element = jsx('div', {})
    render(element, root)
    expect(root.innerHTML).toBe('<div></div>')
  })
})
