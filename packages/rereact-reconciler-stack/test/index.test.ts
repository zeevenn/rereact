import { jsx } from 'rereact/jsx-runtime'
import { describe, expect, it } from 'vitest'
import { render } from '../src'

describe('should', () => {
  it('render empty node when children is null', () => {
    const root = document.createElement('div')
    const element = jsx('div', { children: null })
    render(element, root)
    expect(root.innerHTML).toBe('<div></div>')
  })
})
