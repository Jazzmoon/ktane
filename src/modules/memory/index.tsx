import { Answer, Hint, Segmented, Subhead } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { describeRule, MEMORY_RULES, type Digit, type Stage } from './data'
import { solveMemoryStage, validLabels, type Press } from './solve'

const DIGITS = [1, 2, 3, 4] as const

function RulesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[34rem] border-separate border-spacing-1 text-sm">
        <thead>
          <tr>
            <th className="text-left font-medium text-muted-foreground">Display</th>
            {DIGITS.map((d) => (
              <th key={d} className="font-semibold tabular-nums">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEMORY_RULES.map((row, i) => (
            <tr key={i}>
              <th className="pr-2 text-left font-medium text-muted-foreground">Stage {i + 1}</th>
              {row.map((r, j) => (
                <td key={j} className="rounded-md bg-muted/50 px-2 py-1.5">
                  {describeRule(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function None() {
  return (
    <div className="space-y-3">
      <Hint>Five stages. Remember the position and label you pressed each stage. A mistake resets to stage 1.</Hint>
      <RulesTable />
    </div>
  )
}

const EMPTY_HISTORY: { position: Digit | null; label: Digit | null }[] = Array.from({ length: 5 }, () => ({
  position: null,
  label: null,
}))

function Simplified() {
  const [history, setHistory] = useModuleState('memory:notes', EMPTY_HISTORY)
  const setCell = (i: number, key: 'position' | 'label', v: Digit | null) =>
    setHistory((h) => h.map((x, j) => (j === i ? { ...x, [key]: v } : x)))
  return (
    <div className="space-y-5">
      <RulesTable />
      <div>
        <Subhead>Your presses</Subhead>
        <div className="grid gap-2">
          {history.map((h, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="w-16 text-sm font-medium">Stage {i + 1}</span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                Pos
                <Segmented
                  size="sm"
                  allowDeselect
                  label={`Stage ${i + 1} position`}
                  value={h.position}
                  onChange={(v) => setCell(i, 'position', v)}
                  options={DIGITS.map((d) => ({ value: d, label: d }))}
                />
              </span>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                Label
                <Segmented
                  size="sm"
                  allowDeselect
                  label={`Stage ${i + 1} label`}
                  value={h.label}
                  onChange={(v) => setCell(i, 'label', v)}
                  options={DIGITS.map((d) => ({ value: d, label: d }))}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface State {
  history: Press[]
  display: Digit | null
  labels: string
}
const INITIAL: State = { history: [], display: null, labels: '' }

function Interactive() {
  const [s, set] = useModuleState<State>('memory', INITIAL)
  const stage = (s.history.length + 1) as Stage
  const digits = s.labels.split('').map(Number)
  const ok = validLabels(digits)
  const press = s.display && ok ? solveMemoryStage(stage, s.display, digits, s.history) : null
  const done = s.history.length >= 5

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {[1, 2, 3, 4, 5].map((n) => {
          const h = s.history[n - 1]
          return (
            <span
              key={n}
              className={`rounded-md border px-2 py-1 tabular-nums ${n === stage ? 'border-primary font-semibold' : h ? 'bg-muted text-muted-foreground' : 'text-muted-foreground'}`}
            >
              S{n}
              {h && `: pos ${h.position} · "${h.label}"`}
            </span>
          )
        })}
      </div>
      {done ? (
        <Answer title="Module complete">All five stages recorded.</Answer>
      ) : (
        <>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <div>
              <Subhead>Stage {stage} · display</Subhead>
              <Segmented
                label="Display digit"
                value={s.display}
                onChange={(display) => set((p) => ({ ...p, display }))}
                options={DIGITS.map((d) => ({ value: d, label: <span className="px-1 text-base">{d}</span> }))}
              />
            </div>
            <div>
              <Subhead>Button labels, left to right</Subhead>
              <Input
                aria-label="Button labels left to right"
                inputMode="numeric"
                maxLength={4}
                placeholder="e.g. 2413"
                value={s.labels}
                onChange={(e) => set((p) => ({ ...p, labels: e.target.value.replace(/[^1-4]/g, '').slice(0, 4) }))}
                className="h-11 w-36 font-mono text-lg tracking-[0.4em] sm:h-9"
              />
            </div>
          </div>
          {s.labels.length === 4 && !ok && <Answer tone="stop" title="Labels must be 1, 2, 3 and 4 once each" />}
          {press && (
            <Answer title={`Press position ${press.position} (label "${press.label}")`}>
              <span>{describeRule(MEMORY_RULES[stage - 1]![s.display! - 1]!)}</span>
              <div className="mt-3">
                <Button onClick={() => set((p) => ({ history: [...p.history, press], display: null, labels: '' }))}>
                  Pressed: next stage
                </Button>
              </div>
            </Answer>
          )}
        </>
      )}
      {s.history.length > 0 && (
        <Button variant="outline" size="sm" onClick={() => set(INITIAL)}>
          Strike: back to stage 1
        </Button>
      )}
    </div>
  )
}

export const memory: ModuleDef = {
  id: 'memory',
  title: 'Memory',
  summary: 'Five stages of positions and labels',
  keywords: ['memory', 'stages', 'numbers'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
