import { MORSE, MORSE_WORDS } from './data'

const BY_CODE = new Map(Object.entries(MORSE).map(([letter, code]) => [code, letter]))

export function decode(code: string): string | undefined {
  return BY_CODE.get(code)
}

/**
 * Words consistent with the letters received so far. The word repeats, so the
 * expert may start listening mid-word: match against the word looped twice.
 */
export function candidates(letters: string) {
  const seq = letters.toLowerCase()
  return MORSE_WORDS.filter(({ word }) => (word + word).includes(seq))
}
