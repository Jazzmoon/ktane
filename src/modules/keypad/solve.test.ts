import { describe, expect, it } from 'vitest'
import { COLUMNS, GLYPHS } from './data'
import { candidateColumns, solveKeypad } from './solve'

describe('keypad data', () => {
  it('has 6 columns of 7 known glyphs using all 27 glyphs', () => {
    expect(COLUMNS).toHaveLength(6)
    for (const col of COLUMNS) expect(col).toHaveLength(7)
    expect(new Set(COLUMNS.flat())).toEqual(new Set(GLYPHS))
  })
})

describe('solveKeypad', () => {
  it('orders the four glyphs by their position in the one matching column', () => {
    expect(solveKeypad(['hookn', 'balloon', 'reversedc', 'lambda'])).toEqual({
      column: 0,
      order: ['balloon', 'lambda', 'hookn', 'reversedc'],
    })
    expect(solveKeypad(['omega', 'six', 'ae', 'tracks'])).toEqual({
      column: 5,
      order: ['six', 'tracks', 'ae', 'omega'],
    })
  })

  it('returns null when no column has all four', () => {
    expect(solveKeypad(['omega', 'balloon', 'six', 'at'])).toBeNull()
  })
})

describe('candidateColumns', () => {
  it('narrows columns as glyphs are picked', () => {
    expect(candidateColumns([])).toEqual([0, 1, 2, 3, 4, 5])
    expect(candidateColumns(['balloon'])).toEqual([0, 1])
    expect(candidateColumns(['balloon', 'euro'])).toEqual([1])
    expect(candidateColumns(['omega', 'at'])).toEqual([])
  })
})
