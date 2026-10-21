import { describe, expect, it } from 'vitest'
import { LABEL_WORDS, STEP1, STEP2 } from './data'
import { matchWords, readPosition, wordToPress } from './solve'

describe("who's on first data", () => {
  it('has 28 display words and 28 label words', () => {
    expect(Object.keys(STEP1)).toHaveLength(28)
    expect(LABEL_WORDS).toHaveLength(28)
  })
  it('every list ends with its own label and only contains labels', () => {
    for (const [label, list] of Object.entries(STEP2)) {
      expect(list.at(-1)).toBe(label)
      for (const w of list) expect(LABEL_WORDS).toContain(w)
      expect(new Set(list).size).toBe(list.length)
    }
  })
})

describe('step 1', () => {
  it('maps the display to a button position', () => {
    expect(readPosition('UR')).toBe('TL')
    expect(readPosition('')).toBe('BL')
    expect(readPosition("they're")).toBe('BL')
    expect(readPosition('nonsense')).toBeUndefined()
  })
})

describe('step 2', () => {
  it('returns the first listed word present on the module', () => {
    expect(wordToPress('BLANK', ['NOTHING', 'OKAY', 'BLANK', 'FIRST', 'YES', 'LEFT'])).toBe('OKAY')
    expect(wordToPress('UH HUH', ['YOU', 'UH HUH', 'U', 'UR', 'SURE', 'NEXT'])).toBe('UH HUH')
  })
  it('falls back to the label itself', () => {
    expect(wordToPress('LEFT', ['LEFT', 'WAIT', 'NO', 'YES', 'OKAY', 'PRESS'])).toBe('LEFT')
  })
})

describe('matchWords', () => {
  it('matches ignoring case, spaces and apostrophes', () => {
    expect(matchWords('youre', ['YOU', "YOU'RE", 'YOUR'])).toEqual(["YOU'RE"])
    expect(matchWords('uh h', ['UH HUH', 'UH UH'])).toEqual(['UH HUH'])
    expect(matchWords('', ['A', 'B'])).toEqual(['A', 'B'])
  })
  it('puts exact matches first', () => {
    expect(matchWords('you', ['YOUR', 'YOU', 'YOU ARE'])[0]).toBe('YOU')
  })
})
