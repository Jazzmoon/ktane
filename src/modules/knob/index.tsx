import { Answer, Hint, Subhead } from '@/components/kit'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { KNOB_CONFIGS } from './data'
import { solveKnob } from './solve'

const ARROW = { up: '↑', down: '↓', left: '←', right: '→' } as const

function Led({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-3 rounded-full',
        on ? 'bg-led-on ring-1 ring-black/20' : 'bg-led-off',
        className,
      )}
    />
  )
}

function None() {
  return (
    <div className="space-y-3">
      <Hint>Match the 12 LEDs, then turn the knob so it points the given way relative to the "UP" label.</Hint>
      <ul className="grid gap-2 sm:grid-cols-2">
        {KNOB_CONFIGS.map((c, i) => (
          <li key={i} className="flex items-center gap-4 rounded-lg border px-3 py-2">
            <div className="space-y-1">
              {[c.top, c.bottom].map((row, r) => (
                <div key={r} className="flex gap-1">
                  {[...row].map((ch, j) => (
                    <Led key={j} on={ch === 'x'} className={j === 3 ? 'ml-2' : undefined} />
                  ))}
                </div>
              ))}
            </div>
            <span className="text-lg font-semibold">
              {ARROW[c.dir]} {c.dir.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Simplified() {
  return (
    <div className="space-y-2 text-sm">
      <Hint>Only the left three columns of LEDs matter. Count how many are lit:</Hint>
      <ul className="space-y-1.5">
        <li>
          <strong>4 lit</strong> → ↑ Up
        </li>
        <li>
          <strong>3 lit</strong> → ↓ Down
        </li>
        <li>
          <strong>0 or 1 lit</strong> → ← Left
        </li>
        <li>
          <strong>5 lit</strong> → find the unlit one (top row): <strong>left</strong> unlit → ↓ Down,{' '}
          <strong>middle</strong> unlit → → Right
        </li>
      </ul>
    </div>
  )
}

const INITIAL = [false, false, false, false, false, false]

function Interactive() {
  const [leds, setLeds] = useModuleState<boolean[]>('knob', INITIAL)
  const dir = solveKnob(leds)
  const lit = leds.filter(Boolean).length
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div>
        <Subhead>Tap the lit LEDs (left three columns)</Subhead>
        <div className="inline-grid grid-cols-3 gap-2 rounded-xl border bg-muted/40 p-3">
          {leds.map((on, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={on}
              aria-label={`${i < 3 ? 'Top' : 'Bottom'} row, LED ${(i % 3) + 1}`}
              onClick={() => setLeds((l) => l.map((x, j) => (j === i ? !x : x)))}
              className="flex size-12 items-center justify-center rounded-full focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
            >
              <Led on={on} className="size-9" />
            </button>
          ))}
        </div>
      </div>
      {dir ? (
        <Answer className="min-w-48" title={`${ARROW[dir]} Turn ${dir.toUpperCase()}`}>
          Relative to the "UP" label.
        </Answer>
      ) : (
        lit > 0 && (
          <Answer tone="info" title="No match yet">
            Keep toggling to match the module.
          </Answer>
        )
      )}
    </div>
  )
}

export const knob: ModuleDef = {
  id: 'knob',
  title: 'Knobs',
  summary: 'Needy: point the knob by LED pattern',
  keywords: ['knob', 'needy', 'led', 'dial'],
  needy: true,
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
