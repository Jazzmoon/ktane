export const SEQ_COLORS = ['red', 'blue', 'black'] as const
export type SeqColor = (typeof SEQ_COLORS)[number]
export const SEQ_LETTERS = ['A', 'B', 'C'] as const
export type SeqLetter = (typeof SEQ_LETTERS)[number]

/** Cut the n-th occurrence of a colour if it connects to one of these letters. */
export const OCCURRENCES: Record<SeqColor, readonly string[]> = {
  red: ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'],
  blue: ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'],
  black: ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C'],
}
