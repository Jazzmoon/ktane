import { describe, expect, it } from 'vitest'
import { PASSWORDS } from './data'
import { filterPasswords } from './solve'

describe('passwords', () => {
  it('has 35 five-letter words', () => {
    expect(PASSWORDS).toHaveLength(35)
    for (const w of PASSWORDS) expect(w).toMatch(/^[a-z]{5}$/)
  })

  it('empty columns match everything', () => {
    expect(filterPasswords([])).toHaveLength(35)
    expect(filterPasswords(['', '', ''])).toHaveLength(35)
  })

  it('filters by the letters available in each column', () => {
    expect(filterPasswords(['tw'])).toEqual([
      'their',
      'there',
      'these',
      'thing',
      'think',
      'three',
      'water',
      'where',
      'which',
      'world',
      'would',
      'write',
    ])
    expect(filterPasswords(['tw', 'ha'])).toEqual([
      'their',
      'there',
      'these',
      'thing',
      'think',
      'three',
      'water',
      'where',
      'which',
    ])
    expect(filterPasswords(['tw', 'ha', 'ie', 'ns'])).toEqual(['these', 'thing', 'think'])
    expect(filterPasswords(['tw', 'ha', 'ie', 'ns', 'k'])).toEqual(['think'])
  })

  it('is case-insensitive and ignores non-letters', () => {
    expect(filterPasswords(['P L,'])).toEqual(['large', 'learn', 'place', 'plant', 'point'])
  })
})
