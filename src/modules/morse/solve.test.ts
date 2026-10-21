import { describe, expect, it } from 'vitest'
import { MORSE_WORDS } from './data'
import { candidates, decode } from './solve'

describe('morse', () => {
  it('has 16 distinct words', () => {
    expect(new Set(MORSE_WORDS.map((w) => w.word)).size).toBe(16)
  })

  it('decodes letters', () => {
    expect(decode('...')).toBe('S')
    expect(decode('-.-.')).toBe('C')
    expect(decode('......')).toBeUndefined()
  })

  it('narrows candidates from letters seen so far', () => {
    expect(candidates('').map((w) => w.word)).toHaveLength(16)
    expect(candidates('B').map((w) => w.word)).toEqual([
      'boxes', 'strobe', 'bistro', 'bombs', 'break', 'brick', 'beats',
    ])
    expect(candidates('she').map((w) => w.word)).toEqual(['shell'])
    // "…S" then "H…" can be the end of HALLS looping into its start
    expect(candidates('sh').map((w) => w.word)).toEqual(['shell', 'halls'])
  })

  it('handles starting mid-word because the signal loops', () => {
    expect(candidates('llshe').map((w) => w.word)).toEqual(['shell'])
    expect(candidates('lsha').map((w) => w.word)).toEqual(['halls'])
    expect(candidates('ksb').map((w) => w.word)).toEqual([])
    expect(candidates('ckbr').map((w) => w.word)).toEqual(['brick'])
  })

  it('distinguishes brick from break and trick from slick', () => {
    expect(candidates('bri').map((w) => w.word)).toEqual(['brick'])
    expect(candidates('tri').map((w) => w.word)).toEqual(['trick'])
  })
})
