import { COLUMNS, type Glyph } from './data'

/** Indices of columns that contain every picked glyph. */
export function candidateColumns(picked: readonly Glyph[]): number[] {
  return COLUMNS.flatMap((col, i) => (picked.every((g) => col.includes(g)) ? [i] : []))
}

/** Keypad: press the four symbols in the order they appear in the matching column. */
export function solveKeypad(
  picked: readonly Glyph[],
): { column: number; order: Glyph[] } | null {
  if (picked.length !== 4) return null
  const [column] = candidateColumns(picked)
  if (column === undefined) return null
  return { column, order: COLUMNS[column]!.filter((g) => picked.includes(g)) }
}
