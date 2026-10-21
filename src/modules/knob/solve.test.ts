import { describe, expect, it } from 'vitest'
import { KNOB_CONFIGS } from './data'
import { leftHalf, solveKnob } from './solve'

const lit = (s: string) => [...s].map((c) => c === 'x')

describe('needy knob', () => {
  it('solves every manual configuration from the left half alone', () => {
    for (const c of KNOB_CONFIGS) expect(solveKnob(leftHalf(lit(c.top), lit(c.bottom)))).toBe(c.dir)
  })

  it('agrees with the lit-count shortcut (4 → up, 0/1 → left, 3 → down)', () => {
    for (const c of KNOB_CONFIGS) {
      const n = leftHalf(lit(c.top), lit(c.bottom)).filter(Boolean).length
      if (n === 4) expect(c.dir).toBe('up')
      if (n <= 1) expect(c.dir).toBe('left')
      if (n === 3) expect(c.dir).toBe('down')
    }
  })

  it('returns null for an unknown pattern', () => {
    expect(solveKnob(lit('xxxxxx'))).toBeNull()
  })
})
