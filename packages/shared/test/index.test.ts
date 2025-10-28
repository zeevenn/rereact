import { beforeEach, describe, it, vi } from 'vitest'
import * as ReactSymbols from '../src/ReactSymbols'

describe('reactSymbols', () => {
  beforeEach(() => vi.resetModules())

  const expectToBeUnique = (keyValuePairs: [key: string, value: symbol][]) => {
    const map = new Map<symbol, string>()
    keyValuePairs.forEach(([key, value]) => {
      if (map.has(value)) {
        throw new Error(
          `${key} value ${value.toString()} is the same as ${map.get(value)}.`,
        )
      }
      map.set(value, key)
    })
  }

  it('symbol values should be unique', () => {
    expectToBeUnique(Object.entries(ReactSymbols))
  })
})
