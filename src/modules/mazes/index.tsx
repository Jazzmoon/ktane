import { useState } from 'react'
import { Answer, Hint, Segmented, Subhead } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { MAZES, type MazeDef } from './data'
import { coordName, describePath, findMaze, parseCoord, solveMaze, step, type Cell } from './solve'

const S = 40 // cell size in SVG units
const PAD = 14

function MazeSvg({
  maze,
  start,
  goal,
  path,
  onCell,
  className,
  title,
}: {
  maze?: MazeDef
  start?: Cell | null
  goal?: Cell | null
  path?: readonly ('U' | 'D' | 'L' | 'R')[] | null
  onCell?: (c: Cell) => void
  className?: string
  title: string
}) {
  const markers = maze?.markers.map(parseCoord).filter((c): c is Cell => c !== null) ?? []
  const center = (c: Cell) => ({ x: PAD + c.x * S + S / 2, y: PAD + c.y * S + S / 2 })
  const pathPoints: Cell[] = []
  if (start && path) {
    let at = start
    pathPoints.push(at)
    for (const m of path) pathPoints.push((at = step(at, m)))
  }
  const size = PAD * 2 + S * 6
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={cn('w-full max-w-xs', className)} role="img" aria-label={title}>
      <rect x={PAD} y={PAD} width={S * 6} height={S * 6} rx={4} className="fill-muted/60" />
      {/* column / row labels */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} className="fill-muted-foreground text-[9px] font-medium">
          <text x={PAD + i * S + S / 2} y={PAD - 4} textAnchor="middle">
            {'ABCDEF'[i]}
          </text>
          <text x={PAD - 5} y={PAD + i * S + S / 2 + 3} textAnchor="end">
            {i + 1}
          </text>
        </g>
      ))}
      {/* cells */}
      {Array.from({ length: 36 }, (_, i) => {
        const c = { x: i % 6, y: Math.floor(i / 6) }
        const p = center(c)
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={2.5} className="fill-muted-foreground/40" />
            {onCell && (
              <rect
                x={PAD + c.x * S}
                y={PAD + c.y * S}
                width={S}
                height={S}
                className="cursor-pointer fill-transparent hover:fill-foreground/5"
                onClick={() => onCell(c)}
                role="button"
                aria-label={coordName(c)}
              />
            )}
          </g>
        )
      })}
      {/* walls */}
      {maze?.rows.map((row, y) =>
        row.map((w, x) => (
          <g key={`${x}-${y}`} className="stroke-foreground" strokeWidth={4} strokeLinecap="round">
            {w.includes('E') && (
              <line x1={PAD + (x + 1) * S} y1={PAD + y * S} x2={PAD + (x + 1) * S} y2={PAD + (y + 1) * S} />
            )}
            {w.includes('S') && (
              <line x1={PAD + x * S} y1={PAD + (y + 1) * S} x2={PAD + (x + 1) * S} y2={PAD + (y + 1) * S} />
            )}
          </g>
        )),
      )}
      <rect
        x={PAD}
        y={PAD}
        width={S * 6}
        height={S * 6}
        rx={4}
        className="fill-none stroke-foreground"
        strokeWidth={4}
      />
      {markers.map((m) => {
        const p = center(m)
        return (
          <circle
            key={coordName(m)}
            cx={p.x}
            cy={p.y}
            r={11}
            className="fill-none stroke-wire-green"
            strokeWidth={3.5}
          />
        )
      })}
      {pathPoints.length > 1 && (
        <polyline
          points={pathPoints.map((c) => `${center(c).x},${center(c).y}`).join(' ')}
          className="fill-none stroke-go"
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
      {start && (
        <rect
          x={center(start).x - 8}
          y={center(start).y - 8}
          width={16}
          height={16}
          rx={2}
          className="fill-background stroke-foreground"
          strokeWidth={2.5}
        />
      )}
      {goal && (
        <polygon
          points={`${center(goal).x},${center(goal).y - 10} ${center(goal).x + 9},${center(goal).y + 7} ${center(goal).x - 9},${center(goal).y + 7}`}
          className="fill-wire-red"
        />
      )}
    </svg>
  )
}

function AllMazes({ only }: { only?: number | null }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {MAZES.map((m, i) =>
        only != null && only !== i ? null : (
          <figure key={i} className="flex flex-col items-center">
            <MazeSvg maze={m} title={`Maze ${i + 1}, markers ${m.markers.join(' and ')}`} />
            <figcaption className="text-xs text-muted-foreground">{m.markers.join(' · ')}</figcaption>
          </figure>
        ),
      )}
    </div>
  )
}

function None() {
  return (
    <div className="space-y-3">
      <Hint>
        Match the two green circles to find the maze. Guide the white square to the red triangle without crossing a
        wall.
      </Hint>
      <AllMazes />
    </div>
  )
}

function Simplified() {
  const [q, setQ] = useState('')
  const coord = parseCoord(q)
  const idx = coord ? findMaze(coord) : null
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Input
          aria-label="Circle coordinate"
          value={q}
          maxLength={2}
          onChange={(e) => setQ(e.target.value.toUpperCase())}
          placeholder="A2"
          className="h-11 w-24 font-mono uppercase sm:h-9"
        />
        <Hint>
          {coord && idx === null
            ? 'No maze has a circle there.'
            : 'Enter either circle coordinate (column letter, row number).'}
        </Hint>
      </div>
      <AllMazes only={idx} />
    </div>
  )
}

interface State {
  maze: number | null
  start: Cell | null
  goal: Cell | null
  mode: 'marker' | 'start' | 'goal'
}
const INITIAL: State = { maze: null, start: null, goal: null, mode: 'marker' }

function Interactive() {
  const [s, set] = useModuleState<State>('mazes', INITIAL)
  const maze = s.maze === null ? undefined : MAZES[s.maze]
  const path = maze && s.start && s.goal ? solveMaze(maze, s.start, s.goal) : null

  const onCell = (c: Cell) =>
    set((p) => {
      if (p.mode === 'marker') {
        const m = findMaze(c)
        return m === null ? p : { ...p, maze: m, mode: p.start ? 'goal' : 'start' }
      }
      if (p.mode === 'start') return { ...p, start: c, mode: p.goal ? 'start' : 'goal' }
      return { ...p, goal: c }
    })

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,20rem)_1fr]">
      <MazeSvg
        maze={maze}
        start={s.start}
        goal={s.goal}
        path={path}
        onCell={onCell}
        title="Maze input: tap cells"
        className="max-w-none touch-manipulation"
      />
      <div className="space-y-3">
        <div>
          <Subhead>Tap the grid to place</Subhead>
          <Segmented
            label="Placing"
            value={s.mode}
            onChange={(mode) => mode && set((p) => ({ ...p, mode }))}
            options={[
              { value: 'marker', label: '◯ Circle' },
              { value: 'start', label: '□ You', disabled: !maze },
              { value: 'goal', label: '▲ Goal', disabled: !maze },
            ]}
          />
        </div>
        {!maze ? (
          <Hint>Start by tapping where one of the green circles is.</Hint>
        ) : !s.start || !s.goal ? (
          <Hint>
            Maze {s.maze! + 1} found. Now place {!s.start ? 'your white square' : 'the red triangle'}.
          </Hint>
        ) : path && path.length === 0 ? (
          <Answer title="You're already there" />
        ) : path ? (
          <Answer title={describePath(path).join(', ')}>
            {path.length} moves from {coordName(s.start)} to {coordName(s.goal)}
          </Answer>
        ) : null}
        {(maze || s.start) && (
          <Button variant="outline" size="sm" onClick={() => set(INITIAL)}>
            Start over
          </Button>
        )}
      </div>
    </div>
  )
}

export const mazes: ModuleDef = {
  id: 'mazes',
  title: 'Mazes',
  summary: 'Navigate a hidden-wall maze',
  keywords: ['maze', 'navigate', 'circle', 'triangle', 'path'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
