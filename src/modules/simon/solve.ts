import type { Facts } from '@/lib/bomb'
import { SIMON_TABLE, type SimonColor } from './data'

/** Simon Says: map every flash in the sequence so far to the colour to press. */
export function solveSimon(flashes: readonly SimonColor[], f: Facts): SimonColor[] {
  const row = SIMON_TABLE[f.serialVowel() ? 'vowel' : 'noVowel'][f.strikes()]
  return flashes.map((c) => row[c])
}
