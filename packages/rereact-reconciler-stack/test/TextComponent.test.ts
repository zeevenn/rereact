import { jsx, jsxs } from 'rereact/jsx-runtime'
import { describe, expect, it } from 'vitest'
import { render } from '../src'

describe('textComponent', () => {
  it('updates a mounted text component in place', () => {
    const el = document.createElement('div')
    render(jsxs('div', {
      children: [jsx('span', {}), 'foo', 'bar'],
    }), el)

    let container = el.firstChild!
    const foo = container.childNodes[2]
    const bar = container.childNodes[5]
    expect(foo.nodeValue).toBe('foo')
    expect(bar.nodeValue).toBe('bar')

    render(jsxs('div', {
      children: [jsx('span', {}), 'baz', 'qux'],
    }), el)
    container = el.firstChild!
    // After the update, the text nodes should have stayed in place (as opposed
    // to getting unmounted and remounted)
    expect(container.childNodes[2]).toBe(foo)
    expect(container.childNodes[5]).toBe(bar)
    expect(foo.nodeValue).toBe('baz')
    expect(bar.nodeValue).toBe('qux')
  })

  it('can reconcile text merged by Node.normalize()', () => {
    const el = document.createElement('div')
    render(jsxs('div', {
      children: ['foo', 'bar', 'baz'],
    }), el)

    let container = el.firstChild!
    container.normalize()

    render(jsxs('div', {
      children: ['bar', 'baz', 'qux'],
    }), el)
    container = el.firstChild!
    expect(container.textContent).toBe('barbazqux')
  })
})
