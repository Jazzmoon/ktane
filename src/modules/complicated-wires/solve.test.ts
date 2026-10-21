import { describe, expect, it } from 'vitest'
import { emptyBomb, solveWith, type BombInfo } from '@/lib/bomb'
import { letterFor, solveComplicated, type CompWire } from './solve'

const w = (s: string): CompWire => ({
  red: s.includes('r'),
  blue: s.includes('b'),
  star: s.includes('s'),
  led: s.includes('l'),
})

describe('complicated wires venn diagram', () => {
  it.each([
    ['', 'C'], ['r', 'S'], ['b', 'S'], ['rb', 'S'],
    ['s', 'C'], ['l', 'D'], ['rs', 'C'], ['bs', 'D'],
    ['rl', 'B'], ['bl', 'P'], ['rbs', 'P'], ['rbl', 'S'],
    ['rsl', 'B'], ['bsl', 'P'], ['rbsl', 'D'], ['sl', 'B'],
  ])('wire "%s" → %s', (props, letter) => {
    expect(letterFor(w(props))).toBe(letter)
  })
})

describe('solveComplicated', () => {
  const cut = (props: string, bomb: BombInfo = emptyBomb) =>
    solveWith(bomb, (f) => solveComplicated(w(props), f).cut)

  it('C/D need nothing', () => {
    expect(cut('')).toEqual({ kind: 'answer', value: true })
    expect(cut('l')).toEqual({ kind: 'answer', value: false })
  })
  it('S cuts on an even serial', () => {
    expect(cut('r')).toEqual({ kind: 'need', fact: 'serialOdd' })
    expect(cut('r', { ...emptyBomb, serial: 'AAAAA2' })).toEqual({ kind: 'answer', value: true })
    expect(cut('r', { ...emptyBomb, serial: 'AAAAA3' })).toEqual({ kind: 'answer', value: false })
  })
  it('P cuts with a parallel port', () => {
    expect(cut('bl', { ...emptyBomb, parallelPort: true })).toEqual({ kind: 'answer', value: true })
    expect(cut('bl', { ...emptyBomb, parallelPort: false })).toEqual({ kind: 'answer', value: false })
  })
  it('B cuts with two or more batteries', () => {
    expect(cut('sl', { ...emptyBomb, batteries: 2 })).toEqual({ kind: 'answer', value: true })
    expect(cut('sl', { ...emptyBomb, batteries: 1 })).toEqual({ kind: 'answer', value: false })
  })
})
