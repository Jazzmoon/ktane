import { Answer, cap, NeedFact, RuleList, Segmented, Subhead, Swatch } from '@/components/kit'
import { solveWith } from '@/lib/bomb'
import { useBomb, useSolution } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import {
  BUTTON_COLORS,
  BUTTON_LABELS,
  releaseDigit,
  solveButton,
  STRIP_COLORS,
  type ButtonColor,
  type ButtonLabel,
  type StripColor,
} from './solve'

const RULES = [
  { when: 'Blue button labelled "Abort"', then: 'Hold' },
  { when: 'More than 1 battery and labelled "Detonate"', then: 'Press and release' },
  { when: 'White button and a lit CAR indicator', then: 'Hold' },
  { when: 'More than 2 batteries and a lit FRK indicator', then: 'Press and release' },
  { when: 'Yellow button', then: 'Hold' },
  { when: 'Red button labelled "Hold"', then: 'Press and release' },
  { when: 'Otherwise', then: 'Hold' },
]

function StripTable({ active }: { active?: StripColor | null }) {
  return (
    <div>
      <Subhead>Holding: release when the timer shows…</Subhead>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        {STRIP_COLORS.map((s) => (
          <div
            key={s}
            className={cn('rounded-lg border px-2 py-2', active === s && 'border-go bg-go-soft font-semibold')}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Swatch color={s} /> {s === 'red' ? 'Other' : cap(s)}
            </div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{releaseDigit(s)}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">…in any position. "Other" covers red and any other colour.</p>
    </div>
  )
}

function None() {
  return (
    <div className="space-y-5">
      <div>
        <Subhead>First rule that applies</Subhead>
        <RuleList rules={RULES} />
      </div>
      <StripTable />
    </div>
  )
}

function Simplified() {
  const bomb = useBomb()
  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[22rem] border-separate border-spacing-1 text-center text-sm">
          <thead>
            <tr>
              <th />
              {BUTTON_LABELS.map((l) => (
                <th key={l} className="font-medium text-muted-foreground">
                  {cap(l)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BUTTON_COLORS.map((c) => (
              <tr key={c}>
                <th className="pr-1 text-left font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Swatch color={c} /> {cap(c)}
                  </span>
                </th>
                {BUTTON_LABELS.map((l) => {
                  const r = solveWith(bomb, (f) => solveButton(c, l, f).action)
                  return (
                    <td
                      key={l}
                      title={r.kind === 'need' ? `Depends on ${r.fact}` : undefined}
                      className={cn(
                        'rounded-md py-2 font-semibold',
                        r.kind === 'need'
                          ? 'bg-muted text-muted-foreground'
                          : r.value === 'tap'
                            ? 'bg-go-soft text-go'
                            : 'bg-pending-soft',
                      )}
                    >
                      {r.kind === 'need' ? '?' : r.value === 'tap' ? 'Tap' : 'Hold'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted-foreground">
          "?" cells depend on edgework you haven't entered yet (batteries, CAR, FRK).
        </p>
      </div>
      <StripTable />
    </div>
  )
}

interface State {
  color: ButtonColor | null
  label: ButtonLabel | null
  strip: StripColor | null
}
const INITIAL: State = { color: null, label: null, strip: null }

function Interactive() {
  const [s, set] = useModuleState<State>('button', INITIAL)
  const result = useSolution((f) => (s.color && s.label ? solveButton(s.color, s.label, f) : null))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div>
          <Subhead>Colour</Subhead>
          <Segmented
            label="Button colour"
            value={s.color}
            allowDeselect
            onChange={(color) => set((p) => ({ ...p, color }))}
            options={BUTTON_COLORS.map((c) => ({
              value: c,
              label: (
                <span className="flex items-center gap-1.5">
                  <Swatch color={c} /> {cap(c)}
                </span>
              ),
            }))}
          />
        </div>
        <div>
          <Subhead>Label</Subhead>
          <Segmented
            label="Button label"
            value={s.label}
            allowDeselect
            onChange={(label) => set((p) => ({ ...p, label }))}
            options={BUTTON_LABELS.map((l) => ({ value: l, label: cap(l) }))}
          />
        </div>
      </div>
      {result.kind === 'need' ? (
        <NeedFact fact={result.fact} />
      ) : result.value?.action === 'tap' ? (
        <Answer title="Press and immediately release">{result.value.rule}</Answer>
      ) : result.value?.action === 'hold' ? (
        <>
          <Answer tone="pending" title="Hold the button">
            {result.value.rule}. A coloured strip lights up; pick its colour.
          </Answer>
          <Segmented
            label="Strip colour"
            value={s.strip}
            allowDeselect
            onChange={(strip) => set((p) => ({ ...p, strip }))}
            options={STRIP_COLORS.map((c) => ({
              value: c,
              label: (
                <span className="flex items-center gap-1.5">
                  <Swatch color={c} /> {c === 'red' ? 'Other' : cap(c)}
                </span>
              ),
            }))}
          />
          {s.strip && (
            <Answer title={`Release when the timer shows a ${releaseDigit(s.strip)}`}>In any position.</Answer>
          )}
        </>
      ) : null}
    </div>
  )
}

export const button: ModuleDef = {
  id: 'button',
  title: 'The Button',
  summary: 'Tap or hold a big coloured button',
  keywords: ['button', 'hold', 'abort', 'detonate', 'strip'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
