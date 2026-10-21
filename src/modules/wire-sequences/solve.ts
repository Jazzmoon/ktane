import { OCCURRENCES, type SeqColor, type SeqLetter } from './data'

export interface SeqWire {
  color: SeqColor
  letter: SeqLetter
}

export interface SeqResult extends SeqWire {
  occurrence: number
  /** null when past the end of the table (should not happen in a real bomb). */
  cut: boolean | null
}

/** Resolves every wire seen so far, in order, tracking per-colour occurrence counts. */
export function solveSequence(wires: readonly SeqWire[]): SeqResult[] {
  const seen: Record<SeqColor, number> = { red: 0, blue: 0, black: 0 }
  return wires.map((w) => {
    const occurrence = ++seen[w.color]
    const allowed = OCCURRENCES[w.color][occurrence - 1]
    return { ...w, occurrence, cut: allowed === undefined ? null : allowed.includes(w.letter) }
  })
}
