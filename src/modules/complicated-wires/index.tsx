import { Plus, Star, X } from 'lucide-react'
import { Answer, Hint, NeedFact, Subhead } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { solveWith } from '@/lib/bomb'
import { useBomb } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { LETTER_MEANING, letterFor, resolveLetter, solveComplicated, type CompLetter, type CompWire } from './solve'

const ROWS = [
  { label: 'White', red: false, blue: false },
  { label: 'Red', red: true, blue: false },
  { label: 'Blue', red: false, blue: true },
  { label: 'Red + blue', red: true, blue: true },
]
const COLS = [
  { label: 'Plain', star: false, led: false },
  { label: '★', star: true, led: false },
  { label: 'LED', star: false, led: true },
  { label: '★ + LED', star: true, led: true },
]

function Stripe({ red, blue }: { red: boolean; blue: boolean }) {
  const a = red ? 'var(--wire-red)' : blue ? 'var(--wire-blue)' : 'var(--wire-white)'
  const b = red && blue ? 'var(--wire-blue)' : a
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-8 rounded-full ring-1 ring-inset ring-black/15"
      style={{ background: `repeating-linear-gradient(45deg, ${a} 0 6px, ${b} 6px 12px)` }}
    />
  )
}

function Grid({ resolve }: { resolve?: (l: CompLetter) => boolean | null }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[24rem] border-separate border-spacing-1 text-center text-sm">
        <thead>
          <tr>
            <th />
            {COLS.map((c) => (
              <th key={c.label} className="font-medium text-muted-foreground">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label}>
              <th className="pr-1 text-left font-medium">
                <span className="flex items-center gap-2">
                  <Stripe red={r.red} blue={r.blue} /> {r.label}
                </span>
              </th>
              {COLS.map((c) => {
                const letter = letterFor({ ...r, ...c })
                const cut = resolve?.(letter) ?? null
                return (
                  <td
                    key={c.label}
                    title={LETTER_MEANING[letter]}
                    className={cn(
                      'rounded-md py-2 font-mono text-base font-semibold',
                      cut === true ? 'bg-go-soft text-go' : cut === false ? 'bg-stop-soft text-stop' : 'bg-muted/60',
                    )}
                  >
                    {cut === true ? '✓' : cut === false ? '✗' : letter}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Legend() {
  return (
    <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
      {(Object.keys(LETTER_MEANING) as CompLetter[]).map((l) => (
        <div key={l} className="flex gap-2">
          <dt className="w-4 font-mono font-semibold">{l}</dt>
          <dd className="text-muted-foreground">{LETTER_MEANING[l]}</dd>
        </div>
      ))}
    </dl>
  )
}

function None() {
  return (
    <div className="space-y-4">
      <Hint>Look at each wire's colours, the ★ below it and the LED above it.</Hint>
      <Grid />
      <Legend />
    </div>
  )
}

function Simplified() {
  const bomb = useBomb()
  const resolve = (l: CompLetter) => {
    const r = solveWith(bomb, (f) => resolveLetter(l, f))
    return r.kind === 'answer' ? r.value : null
  }
  return (
    <div className="space-y-4">
      <Hint>✓ cut · ✗ don't cut. Letters left over need edgework you haven't entered.</Hint>
      <Grid resolve={resolve} />
      <Legend />
    </div>
  )
}

const BLANK: CompWire = { red: false, blue: false, star: false, led: false }
const INITIAL: CompWire[] = [BLANK]
const PROPS = [
  { key: 'red', label: 'Red' },
  { key: 'blue', label: 'Blue' },
  { key: 'star', label: <Star className="size-4" aria-label="Star" /> },
  { key: 'led', label: 'LED' },
] as const

function Interactive() {
  const [wires, setWires] = useModuleState<CompWire[]>('complicated-wires', INITIAL)
  const bomb = useBomb()
  const flip = (i: number, key: keyof CompWire) =>
    setWires((ws) => ws.map((w, j) => (j === i ? { ...w, [key]: !w[key] } : w)))

  return (
    <div className="space-y-3">
      <Subhead>Each wire: toggle what applies</Subhead>
      <ol className="space-y-2">
        {wires.map((w, i) => {
          const r = solveWith(bomb, (f) => solveComplicated(w, f))
          return (
            <li key={i} className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
              <span className="w-5 text-right text-sm tabular-nums text-muted-foreground">{i + 1}</span>
              <Stripe red={w.red} blue={w.blue} />
              {PROPS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={w[p.key]}
                  onClick={() => flip(i, p.key)}
                  className={cn(
                    'min-h-11 min-w-12 rounded-md border px-2.5 text-sm font-medium sm:min-h-9',
                    'focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
                    w[p.key] ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-accent',
                  )}
                >
                  {p.label}
                </button>
              ))}
              <span className="ml-auto flex items-center gap-2">
                {r.kind === 'need' ? (
                  <span className="text-sm text-pending">needs info</span>
                ) : (
                  <span
                    className={cn(
                      'rounded-md px-2.5 py-1 text-sm font-bold',
                      r.value.cut ? 'bg-go-soft text-go' : 'bg-stop-soft text-stop',
                    )}
                  >
                    {r.value.cut ? 'CUT' : "DON'T"}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-9"
                  aria-label={`Remove wire ${i + 1}`}
                  onClick={() => setWires((ws) => ws.filter((_, j) => j !== i))}
                >
                  <X />
                </Button>
              </span>
              {r.kind === 'need' && <NeedFact fact={r.fact} className="mt-1" />}
            </li>
          )
        })}
      </ol>
      <Button variant="outline" onClick={() => setWires((ws) => [...ws, BLANK])} disabled={wires.length >= 6}>
        <Plus /> Add wire
      </Button>
      {wires.length === 0 && <Answer tone="info" title="Add a wire to begin" />}
    </div>
  )
}

export const complicatedWires: ModuleDef = {
  id: 'complicated-wires',
  title: 'Complicated Wires',
  summary: 'Striped wires with stars and LEDs',
  keywords: ['venn', 'complicated', 'wires', 'led', 'star', 'striped'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
