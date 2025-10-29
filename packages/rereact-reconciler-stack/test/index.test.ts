import { describe, expect, it } from 'vitest'
import { sum } from '../src'

describe('should', () => {
  it('one plus one equals two', () => {
    expect(sum(1, 1)).toEqual(2)
  })
})
