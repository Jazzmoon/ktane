import { describe, expect, it } from 'vitest'
import { emptyBomb, factsOf, MissingFact, solveWith } from './bomb'

describe('factsOf', () => {
  it('treats everything as unknown on an empty bomb', () => {
    const f = factsOf(emptyBomb)
    expect(() => f.batteries()).toThrow(MissingFact)
    expect(() => f.serialOdd()).toThrow(MissingFact)
    expect(() => f.serialVowel()).toThrow(MissingFact)
    expect(() => f.litCAR()).toThrow(MissingFact)
    expect(() => f.litFRK()).toThrow(MissingFact)
    expect(() => f.parallelPort()).toThrow(MissingFact)
    expect(() => f.strikes()).toThrow(MissingFact)
  })

  it('derives serial parity from the last digit of a complete serial', () => {
    expect(factsOf({ ...emptyBomb, serial: 'AB3XY7' }).serialOdd()).toBe(true)
    expect(factsOf({ ...emptyBomb, serial: 'ab3xy8' }).serialOdd()).toBe(false)
  })

  it('uses the last digit even if the serial does not end in one', () => {
    expect(factsOf({ ...emptyBomb, serial: 'A12BCD' }).serialOdd()).toBe(false)
  })

  it('does not guess parity from a partial serial', () => {
    expect(() => factsOf({ ...emptyBomb, serial: 'AB3' }).serialOdd()).toThrow(MissingFact)
  })

  it('confirms a vowel as soon as one is typed, but only denies when complete', () => {
    expect(factsOf({ ...emptyBomb, serial: 'E' }).serialVowel()).toBe(true)
    expect(() => factsOf({ ...emptyBomb, serial: 'BC' }).serialVowel()).toThrow(MissingFact)
    expect(factsOf({ ...emptyBomb, serial: 'BCD123' }).serialVowel()).toBe(false)
  })

  it('does not count Y as a vowel', () => {
    expect(factsOf({ ...emptyBomb, serial: 'YYY111' }).serialVowel()).toBe(false)
  })

  it('returns known values', () => {
    const f = factsOf({
      ...emptyBomb,
      batteries: 0,
      litCAR: false,
      litFRK: true,
      parallelPort: false,
      strikes: 2,
    })
    expect(f.batteries()).toBe(0)
    expect(f.litCAR()).toBe(false)
    expect(f.litFRK()).toBe(true)
    expect(f.parallelPort()).toBe(false)
    expect(f.strikes()).toBe(2)
  })
})

describe('solveWith', () => {
  it('returns an answer when every fact used is known', () => {
    const r = solveWith({ ...emptyBomb, batteries: 3 }, (f) => f.batteries() * 2)
    expect(r).toEqual({ kind: 'answer', value: 6 })
  })

  it('reports the first missing fact instead of guessing', () => {
    const r = solveWith(emptyBomb, (f) => f.batteries())
    expect(r).toEqual({ kind: 'need', fact: 'batteries' })
  })

  it('only needs facts on the branch actually taken', () => {
    const r = solveWith(emptyBomb, () => 'cut 2')
    expect(r).toEqual({ kind: 'answer', value: 'cut 2' })
  })

  it('rethrows unrelated errors', () => {
    expect(() =>
      solveWith(emptyBomb, () => {
        throw new Error('boom')
      }),
    ).toThrow('boom')
  })
})
