import { MAZES, type MazeDef } from './data'

export interface Cell {
  /** Column 0–5 (A–F) */
  x: number
  /** Row 0–5 (1–6) */
  y: number
}
export type Move = 'U' | 'D' | 'L' | 'R'

const DELTA: Record<Move, Cell> = { U: { x: 0, y: -1 }, D: { x: 0, y: 1 }, L: { x: -1, y: 0 }, R: { x: 1, y: 0 } }

export const coordName = (c: Cell) => `${'ABCDEF'[c.x]}${c.y + 1}`

export function parseCoord(text: string): Cell | null {
  const m = /^([A-F])([1-6])$/i.exec(text.trim())
  return m ? { x: m[1]!.toUpperCase().charCodeAt(0) - 65, y: Number(m[2]) - 1 } : null
}

export const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y

export function findMaze(marker: Cell): number | null {
  const name = coordName(marker)
  const i = MAZES.findIndex((m) => m.markers.includes(name))
  return i < 0 ? null : i
}

const wallAt = (maze: MazeDef, c: Cell) => maze.rows[c.y]?.[c.x] ?? ''

export function step(c: Cell, move: Move): Cell {
  return { x: c.x + DELTA[move].x, y: c.y + DELTA[move].y }
}

export function canMove(maze: MazeDef, from: Cell, move: Move): boolean {
  const to = step(from, move)
  if (to.x < 0 || to.x > 5 || to.y < 0 || to.y > 5) return false
  switch (move) {
    case 'R':
      return !wallAt(maze, from).includes('E')
    case 'L':
      return !wallAt(maze, to).includes('E')
    case 'D':
      return !wallAt(maze, from).includes('S')
    case 'U':
      return !wallAt(maze, to).includes('S')
  }
}

/** Shortest move list from start to goal (BFS), or null if unreachable. */
export function solveMaze(maze: MazeDef, start: Cell, goal: Cell): Move[] | null {
  const key = (c: Cell) => c.y * 6 + c.x
  const prev = new Map<number, { from: Cell; move: Move } | null>([[key(start), null]])
  const queue: Cell[] = [start]
  while (queue.length) {
    const at = queue.shift()!
    if (sameCell(at, goal)) {
      const path: Move[] = []
      for (let p = prev.get(key(at)); p; p = prev.get(key(p.from))) path.unshift(p.move)
      return path
    }
    for (const move of ['U', 'R', 'D', 'L'] as const) {
      if (!canMove(maze, at, move)) continue
      const next = step(at, move)
      if (prev.has(key(next))) continue
      prev.set(key(next), { from: at, move })
      queue.push(next)
    }
  }
  return null
}

const MOVE_WORDS: Record<Move, string> = { U: 'Up', D: 'Down', L: 'Left', R: 'Right' }

/** Collapses a path into runs, e.g. ["Up ×2", "Right"]. */
export function describePath(path: readonly Move[]): string[] {
  const out: { move: Move; n: number }[] = []
  for (const m of path) {
    const last = out.at(-1)
    if (last?.move === m) last.n++
    else out.push({ move: m, n: 1 })
  }
  return out.map(({ move, n }) => (n > 1 ? `${MOVE_WORDS[move]} ×${n}` : MOVE_WORDS[move]))
}
