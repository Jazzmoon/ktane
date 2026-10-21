export const SIMON_COLORS = ['red', 'blue', 'green', 'yellow'] as const
export type SimonColor = (typeof SIMON_COLORS)[number]

type Row = Record<SimonColor, SimonColor>

/** flash colour → colour to press, by serial vowel and strike count. */
export const SIMON_TABLE: Record<'vowel' | 'noVowel', readonly [Row, Row, Row]> = {
  vowel: [
    { red: 'blue', blue: 'red', green: 'yellow', yellow: 'green' },
    { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' },
    { red: 'green', blue: 'red', green: 'yellow', yellow: 'blue' },
  ],
  noVowel: [
    { red: 'blue', blue: 'yellow', green: 'green', yellow: 'red' },
    { red: 'red', blue: 'blue', green: 'yellow', yellow: 'green' },
    { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' },
  ],
}
