import { Answer, Hint, Subhead } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { COLUMNS, GLYPH_NAMES, GLYPHS, type Glyph } from './data'
import { GLYPH_PATHS } from './glyph-paths'
import { candidateColumns, solveKeypad } from './solve'

export function GlyphIcon({ glyph, className }: { glyph: Glyph; className?: string }) {
  const p = GLYPH_PATHS[glyph]
  return (
    <svg viewBox={p.viewBox} className={cn('size-8', className)} role="img" aria-label={GLYPH_NAMES[glyph]}>
      <g transform={p.transform} fill="currentColor">
        <path d={p.d} />
      </g>
    </svg>
  )
}

function Columns({ highlight }: { highlight?: number }) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-3">
      {COLUMNS.map((col, i) => (
        <ol
          key={i}
          aria-label={`Column ${i + 1}`}
          className={cn(
            'flex flex-col items-center gap-1 rounded-lg border p-1 sm:p-2',
            highlight === i && 'border-go bg-go-soft',
          )}
        >
          {col.map((g) => (
            <li key={g}>
              <GlyphIcon glyph={g} className="size-9 sm:size-11" />
            </li>
          ))}
        </ol>
      ))}
    </div>
  )
}

function None() {
  return (
    <>
      <Hint>Only one column contains all four symbols. Press them in that column's order, top to bottom.</Hint>
      <div className="mt-4">
        <Columns />
      </div>
    </>
  )
}

const INITIAL: Glyph[] = []

function Interactive() {
  const [picked, setPicked] = useModuleState<Glyph[]>('keypad', INITIAL)
  const cols = candidateColumns(picked)
  const possible = new Set(cols.flatMap((c) => COLUMNS[c]!))
  const solution = solveKeypad(picked)

  const toggle = (g: Glyph) =>
    setPicked((p) => (p.includes(g) ? p.filter((x) => x !== g) : p.length < 4 ? [...p, g] : p))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Subhead className="mb-0">Tap the 4 symbols you see ({picked.length}/4)</Subhead>
        {picked.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setPicked([])}>
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
        {GLYPHS.map((g) => {
          const on = picked.includes(g)
          const dim = !on && (!possible.has(g) || picked.length >= 4)
          return (
            <button
              key={g}
              type="button"
              aria-pressed={on}
              title={GLYPH_NAMES[g]}
              onClick={() => toggle(g)}
              className={cn(
                'flex aspect-square items-center justify-center rounded-lg border bg-card transition',
                'focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none hover:bg-accent',
                on && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
                dim && 'opacity-25',
              )}
            >
              <GlyphIcon glyph={g} className="size-[70%]" />
            </button>
          )
        })}
      </div>
      {solution ? (
        <Answer title="Press in this order">
          <ol className="mt-2 flex gap-3 text-foreground">
            {solution.order.map((g, i) => (
              <li key={g} className="flex flex-col items-center gap-1">
                <span className="flex size-14 items-center justify-center rounded-lg border bg-card">
                  <GlyphIcon glyph={g} className="size-10" />
                </span>
                <span className="text-sm font-semibold tabular-nums">{i + 1}</span>
              </li>
            ))}
          </ol>
        </Answer>
      ) : picked.length > 0 && cols.length === 0 ? (
        <Answer tone="stop" title="No column has all of these">
          Double-check the symbols; one is probably misidentified.
        </Answer>
      ) : null}
    </div>
  )
}

export const keypad: ModuleDef = {
  id: 'keypad',
  title: 'Keypad',
  summary: 'Four symbols, press in column order',
  keywords: ['symbols', 'glyphs', 'keypad', 'column'],
  stateful: true,
  views: { none: None, interactive: Interactive },
}
