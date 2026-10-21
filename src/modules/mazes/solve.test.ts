import { describe, expect, it } from 'vitest'
import { MAZES } from './data'
import { canMove, findMaze, parseCoord, solveMaze, step, type Cell } from './solve'

describe('maze data', () => {
  it.each(MAZES.map((m, i) => [i + 1, m] as const))('maze %i is a perfect 6×6 maze', (_, maze) => {
    expect(maze.rows).toHaveLength(6)
    for (const row of maze.rows) expect(row).toHaveLength(6)
    const walls = maze.rows.flat().join('').length
    expect(walls).toBe(25)
    // every cell reachable from A1
    for (let x = 0; x < 6; x++)
      for (let y = 0; y < 6; y++) expect(solveMaze(maze, { x: 0, y: 0 }, { x, y })).not.toBeNull()
  })

  it('every marker coordinate identifies exactly one maze', () => {
    const markers = MAZES.flatMap((m) => m.markers)
    expect(new Set(markers).size).toBe(18)
  })
})

describe('parseCoord', () => {
  it('parses column letter + row number', () => {
    expect(parseCoord('A1')).toEqual({ x: 0, y: 0 })
    expect(parseCoord('f6')).toEqual({ x: 5, y: 5 })
    expect(parseCoord('G1')).toBeNull()
    expect(parseCoord('A7')).toBeNull()
  })
})

describe('findMaze', () => {
  it('finds a maze from either marker', () => {
    expect(findMaze({ x: 0, y: 1 })).toBe(0) // A2
    expect(findMaze({ x: 5, y: 2 })).toBe(0) // F3
    expect(findMaze({ x: 2, y: 1 })).toBe(8) // C2
    expect(findMaze({ x: 3, y: 3 })).toBe(2) // D4
    expect(findMaze({ x: 1, y: 1 })).toBeNull()
  })
})

describe('solveMaze', () => {
  it('returns an empty path when already at the goal', () => {
    expect(solveMaze(MAZES[0]!, { x: 2, y: 2 }, { x: 2, y: 2 })).toEqual([])
  })

  it('returns a wall-free path that ends on the goal', () => {
    for (const maze of MAZES) {
      const start: Cell = { x: 0, y: 5 }
      const goal: Cell = { x: 5, y: 0 }
      const path = solveMaze(maze, start, goal)!
      let at = start
      for (const move of path) {
        expect(canMove(maze, at, move)).toBe(true)
        at = step(at, move)
      }
      expect(at).toEqual(goal)
    }
  })

  it('respects walls in maze 1', () => {
    const m = MAZES[0]!
    // A1 has no east wall, B1 has a south wall, C1 has an east wall
    expect(canMove(m, { x: 0, y: 0 }, 'R')).toBe(true)
    expect(canMove(m, { x: 1, y: 0 }, 'D')).toBe(false)
    expect(canMove(m, { x: 2, y: 0 }, 'R')).toBe(false)
    expect(canMove(m, { x: 3, y: 0 }, 'L')).toBe(false)
    expect(canMove(m, { x: 0, y: 0 }, 'U')).toBe(false)
  })
})
