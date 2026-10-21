import type { Facts } from '@/lib/bomb'

export interface CompWire {
  red: boolean
  blue: boolean
  star: boolean
  led: boolean
}

export type CompLetter = 'C' | 'D' | 'S' | 'P' | 'B'

export const LETTER_MEANING: Record<CompLetter, string> = {
  C: 'Cut the wire',
  D: 'Do not cut the wire',
  S: 'Cut if the last serial digit is even',
  P: 'Cut if the bomb has a parallel port',
  B: 'Cut if the bomb has two or more batteries',
}

/** Venn diagram regions, indexed by bitmask red|blue<<1|star<<2|led<<3. */
const VENN: readonly CompLetter[] = [
  'C',
  'S',
  'S',
  'S', //       -, r, b, rb
  'C',
  'C',
  'D',
  'P', // s:    -, r, b, rb
  'D',
  'B',
  'P',
  'S', // l:    -, r, b, rb
  'B',
  'B',
  'P',
  'D', // s+l:  -, r, b, rb
]

export function letterFor(w: CompWire): CompLetter {
  const i = Number(w.red) | (Number(w.blue) << 1) | (Number(w.star) << 2) | (Number(w.led) << 3)
  return VENN[i]!
}

export function resolveLetter(letter: CompLetter, f: Facts): boolean {
  switch (letter) {
    case 'C':
      return true
    case 'D':
      return false
    case 'S':
      return !f.serialOdd()
    case 'P':
      return f.parallelPort()
    case 'B':
      return f.batteries() >= 2
  }
}

export function solveComplicated(w: CompWire, f: Facts) {
  const letter = letterFor(w)
  return { letter, cut: resolveLetter(letter, f) }
}
