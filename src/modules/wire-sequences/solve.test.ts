import { describe, expect, it } from 'vitest'
import { OCCURRENCES } from './data'
import { solveSequence } from './solve'

describe('wire sequences', () => {
  it('has 9 occurrences per colour', () => {
    for (const col of Object.values(OCCURRENCES)) expect(col).toHaveLength(9)
  })

  it('counts occurrences per colour across panels', () => {
    const r = solveSequence([
      { color: 'red', letter: 'C' }, // red #1 → C: cut
      { color: 'blue', letter: 'A' }, // blue #1 → B: no
      { color: 'red', letter: 'C' }, // red #2 → B: no
      { color: 'red', letter: 'A' }, // red #3 → A: cut
      { color: 'black', letter: 'B' }, // black #1 → ABC: cut
    ])
    expect(r.map((x) => [x.occurrence, x.cut])).toEqual([
      [1, true],
      [1, false],
      [2, false],
      [3, true],
      [1, true],
    ])
  })

  it('reports impossible occurrences beyond the 9th', () => {
    const r = solveSequence(Array.from({ length: 10 }, () => ({ color: 'red' as const, letter: 'B' as const })))
    expect(r[9]!.cut).toBeNull()
  })
})
