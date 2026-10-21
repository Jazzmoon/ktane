/**
 * The nine mazes. Each row lists its six cells left to right; a cell string
 * contains "E" if there is a wall on its east side and "S" for its south side.
 * Outer walls are implicit. Extracted programmatically from the legacy maze
 * images and verified to be perfect mazes (25 walls, fully connected).
 */
export interface MazeDef {
  /** The two circle-marker coordinates, e.g. "A2". */
  markers: readonly [string, string]
  rows: readonly (readonly string[])[]
}

export const MAZES: readonly MazeDef[] = [
  {
    markers: ['A2', 'F3'],
    rows: [
      ['', 'S', 'E', '', 'S', 'S'],
      ['E', '', 'ES', 'S', 'S', ''],
      ['E', 'S', 'E', '', 'S', ''],
      ['E', 'S', 'S', 'ES', 'S', ''],
      ['', 'S', 'E', '', 'ES', ''],
      ['', 'E', '', 'E', '', ''],
    ],
  },
  {
    markers: ['B4', 'E2'],
    rows: [
      ['S', '', 'ES', '', '', 'S'],
      ['', 'ES', '', 'ES', 'S', ''],
      ['E', '', 'ES', '', 'S', ''],
      ['', 'ES', '', 'ES', 'E', ''],
      ['E', 'E', 'E', '', 'ES', ''],
      ['E', '', 'E', '', '', ''],
    ],
  },
  {
    markers: ['D4', 'F4'],
    rows: [
      ['', 'S', 'E', 'E', '', ''],
      ['ES', 'E', 'E', 'S', 'ES', ''],
      ['', 'E', 'E', '', 'E', ''],
      ['E', 'E', 'E', 'E', 'E', ''],
      ['E', 'S', 'ES', 'E', 'E', ''],
      ['', '', '', 'E', '', ''],
    ],
  },
  {
    markers: ['A1', 'A4'],
    rows: [
      ['', 'E', 'S', 'S', 'S', ''],
      ['E', 'E', '', 'S', 'S', ''],
      ['E', 'S', 'ES', '', 'ES', ''],
      ['E', 'S', 'S', 'S', 'S', ''],
      ['', 'S', 'S', 'S', 'E', ''],
      ['', '', 'E', '', 'E', ''],
    ],
  },
  {
    markers: ['D6', 'E3'],
    rows: [
      ['S', 'S', 'S', 'S', '', ''],
      ['', 'S', 'S', '', 'ES', 'S'],
      ['', 'E', 'S', 'ES', '', ''],
      ['E', 'S', 'S', 'E', 'ES', ''],
      ['E', '', 'S', 'S', 'ES', ''],
      ['E', '', '', '', '', ''],
    ],
  },
  {
    markers: ['C5', 'E1'],
    rows: [
      ['E', '', 'E', 'S', '', ''],
      ['E', 'E', 'E', '', 'ES', ''],
      ['', 'ES', 'ES', 'E', '', 'S'],
      ['S', 'E', '', 'E', 'E', ''],
      ['', 'ES', 'ES', 'E', 'S', ''],
      ['', '', '', 'E', '', ''],
    ],
  },
  {
    markers: ['B1', 'B6'],
    rows: [
      ['', 'S', 'S', 'E', '', ''],
      ['E', '', 'ES', 'S', 'ES', ''],
      ['S', 'ES', '', 'ES', '', 'S'],
      ['', 'E', '', 'S', 'ES', ''],
      ['E', 'ES', 'S', 'S', 'E', ''],
      ['', '', '', '', '', ''],
    ],
  },
  {
    markers: ['C4', 'D1'],
    rows: [
      ['E', '', 'S', 'E', '', ''],
      ['', 'S', 'ES', 'S', 'ES', ''],
      ['E', '', 'S', 'S', 'E', ''],
      ['E', 'S', 'E', 'S', 'S', 'S'],
      ['E', 'E', 'S', 'S', 'S', 'S'],
      ['', '', '', '', '', ''],
    ],
  },
  {
    markers: ['A5', 'C2'],
    rows: [
      ['E', '', 'S', 'S', '', ''],
      ['E', 'E', '', 'ES', 'E', ''],
      ['', 'S', 'ES', '', 'ES', ''],
      ['E', 'E', '', 'ES', 'S', ''],
      ['E', 'E', 'E', '', 'E', 'S'],
      ['', 'E', '', 'E', '', ''],
    ],
  },
]
