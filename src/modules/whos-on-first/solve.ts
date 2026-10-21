import { STEP1, STEP2, type Position } from './data'

export function readPosition(display: string): Position | undefined {
  return STEP1[display.toUpperCase()]
}

export function wordToPress(label: string, onModule: readonly string[]): string | undefined {
  const present = new Set(onModule.map((w) => w.toUpperCase()))
  return STEP2[label.toUpperCase()]?.find((w) => present.has(w))
}

const norm = (s: string) => s.toUpperCase().replace(/[\s']/g, '')

/** Fuzzy-ish filter for word pickers: ignores spacing/apostrophes, exact first. */
export function matchWords(query: string, words: readonly string[]): string[] {
  const q = norm(query)
  if (!q) return [...words]
  const hits = words.filter((w) => norm(w).includes(q))
  return hits.sort((a, b) => Number(norm(b) === q) - Number(norm(a) === q))
}
