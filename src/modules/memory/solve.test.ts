import { describe, expect, it } from 'vitest'
import { solveMemoryStage, type Press } from './solve'

describe('memory', () => {
  it('stage 1 uses fixed positions', () => {
    expect(solveMemoryStage(1, 1, [4, 3, 2, 1], [])).toEqual({ position: 2, label: 3 })
    expect(solveMemoryStage(1, 4, [4, 3, 2, 1], [])).toEqual({ position: 4, label: 1 })
  })

  it('stage 2 can press a label or reuse stage 1 position', () => {
    const h: Press[] = [{ position: 2, label: 3 }]
    expect(solveMemoryStage(2, 1, [1, 2, 4, 3], h)).toEqual({ position: 3, label: 4 })
    expect(solveMemoryStage(2, 2, [1, 2, 4, 3], h)).toEqual({ position: 2, label: 2 })
  })

  it('full five-stage game', () => {
    const history: Press[] = []
    const play = (display: 1 | 2 | 3 | 4, labels: [number, number, number, number]) => {
      const p = solveMemoryStage((history.length + 1) as 1, display, labels as never, history)
      history.push(p)
      return p
    }
    expect(play(3, [2, 4, 1, 3])).toEqual({ position: 3, label: 1 })
    expect(play(1, [3, 1, 4, 2])).toEqual({ position: 3, label: 4 })
    expect(play(2, [1, 2, 3, 4])).toEqual({ position: 1, label: 1 }) // label of stage 1
    expect(play(3, [4, 3, 2, 1])).toEqual({ position: 3, label: 2 }) // position of stage 2
    expect(play(3, [1, 3, 2, 4])).toEqual({ position: 3, label: 2 }) // label of stage 4
  })

  it('throws when an earlier stage is missing', () => {
    expect(() => solveMemoryStage(2, 2, [1, 2, 3, 4], [])).toThrow()
  })
})
