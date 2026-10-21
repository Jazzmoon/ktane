import { describe, expect, it } from 'vitest'
import { emptyBomb, solveWith } from '@/lib/bomb'
import { SIMON_TABLE } from './data'
import { solveSimon } from './solve'

const vowel = { ...emptyBomb, serial: 'AB1234' }
const noVowel = { ...emptyBomb, serial: 'BC1234' }

describe('simon says table', () => {
  it('maps each colour to a colour, every row a permutation-free lookup', () => {
    for (const v of [true, false])
      for (const s of [0, 1, 2] as const)
        expect(Object.keys(SIMON_TABLE[v ? 'vowel' : 'noVowel'][s]).sort()).toEqual(['blue', 'green', 'red', 'yellow'])
  })
})

describe('solveSimon', () => {
  it('serial with vowel, 0 strikes', () => {
    expect(solveWith({ ...vowel, strikes: 0 }, (f) => solveSimon(['red', 'blue', 'green', 'yellow'], f))).toEqual({
      kind: 'answer',
      value: ['blue', 'red', 'yellow', 'green'],
    })
  })
  it('serial with vowel, 1 and 2 strikes', () => {
    expect(solveWith({ ...vowel, strikes: 1 }, (f) => solveSimon(['red', 'blue', 'green', 'yellow'], f))).toEqual({
      kind: 'answer',
      value: ['yellow', 'green', 'blue', 'red'],
    })
    expect(solveWith({ ...vowel, strikes: 2 }, (f) => solveSimon(['red', 'blue', 'green', 'yellow'], f))).toEqual({
      kind: 'answer',
      value: ['green', 'red', 'yellow', 'blue'],
    })
  })
  it('serial without vowel, 0/1/2 strikes', () => {
    const flashes = ['red', 'blue', 'green', 'yellow'] as const
    expect(solveWith({ ...noVowel, strikes: 0 }, (f) => solveSimon(flashes, f))).toEqual({
      kind: 'answer',
      value: ['blue', 'yellow', 'green', 'red'],
    })
    expect(solveWith({ ...noVowel, strikes: 1 }, (f) => solveSimon(flashes, f))).toEqual({
      kind: 'answer',
      value: ['red', 'blue', 'yellow', 'green'],
    })
    expect(solveWith({ ...noVowel, strikes: 2 }, (f) => solveSimon(flashes, f))).toEqual({
      kind: 'answer',
      value: ['yellow', 'green', 'blue', 'red'],
    })
  })
  it('needs the serial and strikes', () => {
    expect(solveWith(emptyBomb, (f) => solveSimon(['red'], f))).toEqual({
      kind: 'need',
      fact: 'serialVowel',
    })
    expect(solveWith(vowel, (f) => solveSimon(['red'], f))).toEqual({
      kind: 'need',
      fact: 'strikes',
    })
  })
})
