import { Undo2 } from 'lucide-react'
import { Answer, cap, Hint, Segmented, Subhead, Swatch } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { OCCURRENCES, SEQ_COLORS, SEQ_LETTERS, type SeqColor, type SeqLetter } from './data'
import { solveSequence, type SeqWire } from './solve'

const fmt = (letters: string) => (letters === 'ABC' ? 'any' : letters.split('').join(' or '))

function Table({ struck, onToggle }: { struck?: readonly string[]; onToggle?: (key: string) => void }) {
  return (
    <table className="w-full border-separate border-spacing-1 text-center text-sm">
      <thead>
        <tr>
          <th className="w-10 text-muted-foreground">#</th>
          {SEQ_COLORS.map((c) => (
            <th key={c} className="font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Swatch color={c} /> {cap(c)}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 9 }, (_, i) => (
          <tr key={i}>
            <th className="font-medium tabular-nums text-muted-foreground">{i + 1}</th>
            {SEQ_COLORS.map((c) => {
              const key = `${c}${i}`
              const isStruck = struck?.includes(key)
              const content = fmt(OCCURRENCES[c][i]!)
              return (
                <td key={c} className="p-0">
                  {onToggle ? (
                    <button
                      type="button"
                      aria-pressed={isStruck}
                      onClick={() => onToggle(key)}
                      className={cn(
                        'w-full rounded-md bg-muted/50 py-2 font-mono font-semibold',
                        'focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none hover:bg-accent',
                        isStruck && 'line-through decoration-2 opacity-40',
                      )}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className="rounded-md bg-muted/50 py-2 font-mono font-semibold">{content}</div>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function None() {
  return (
    <div className="space-y-3">
      <Hint>
        Count each colour across all panels. Cut the nth wire of a colour if it connects to the listed letter.
      </Hint>
      <Table />
    </div>
  )
}

const NO_STRIKES: string[] = []

function Simplified() {
  const [struck, setStruck] = useModuleState<string[]>('wire-sequences:struck', NO_STRIKES)
  return (
    <div className="space-y-3">
      <Hint>Tap an entry to strike it off once that occurrence is used.</Hint>
      <Table
        struck={struck}
        onToggle={(k) => setStruck((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))}
      />
    </div>
  )
}

interface State {
  wires: SeqWire[]
  color: SeqColor | null
}
const INITIAL: State = { wires: [], color: null }

function Interactive() {
  const [s, set] = useModuleState<State>('wire-sequences', INITIAL)
  const results = solveSequence(s.wires)
  const counts = Object.fromEntries(SEQ_COLORS.map((c) => [c, s.wires.filter((w) => w.color === c).length]))
  const add = (letter: SeqLetter | null) => {
    if (!letter || !s.color) return
    set((p) => ({ wires: [...p.wires, { color: p.color!, letter }], color: null }))
  }
  const last = results.at(-1)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <div>
          <Subhead>Wire colour</Subhead>
          <Segmented
            label="Wire colour"
            value={s.color}
            allowDeselect
            onChange={(color) => set((p) => ({ ...p, color }))}
            options={SEQ_COLORS.map((c) => ({
              value: c,
              label: (
                <span className="flex items-center gap-1.5">
                  <Swatch color={c} /> {cap(c)} <span className="text-xs text-muted-foreground">({counts[c]})</span>
                </span>
              ),
            }))}
          />
        </div>
        <div>
          <Subhead>Connects to</Subhead>
          <Segmented
            label="Connected letter"
            value={null}
            onChange={add}
            options={SEQ_LETTERS.map((l) => ({
              value: l,
              label: <span className="px-1.5 font-mono text-base">{l}</span>,
              disabled: !s.color,
            }))}
          />
        </div>
      </div>
      {last && (
        <Answer
          tone={last.cut ? 'go' : 'stop'}
          title={last.cut === null ? 'Past the end of the table' : last.cut ? 'CUT this wire' : "DON'T cut this wire"}
        >
          <span className="inline-flex items-center gap-1.5">
            <Swatch color={last.color} /> {cap(last.color)} #{last.occurrence} → {last.letter}
          </span>
        </Answer>
      )}
      {results.length > 0 && (
        <div className="space-y-2">
          <ol className="flex flex-wrap gap-1.5 text-sm">
            {results.map((r, i) => (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-1.5 rounded-md border px-2 py-1',
                  r.cut ? 'border-go/40' : 'opacity-70',
                )}
              >
                <Swatch color={r.color} />
                <span className="font-mono">{r.letter}</span>
                <span className={r.cut ? 'text-go' : 'text-stop'}>{r.cut ? '✓' : '✗'}</span>
              </li>
            ))}
          </ol>
          <Button variant="ghost" size="sm" onClick={() => set((p) => ({ ...p, wires: p.wires.slice(0, -1) }))}>
            <Undo2 /> Undo last wire
          </Button>
        </div>
      )}
      <Hint>Enter every wire on every panel, top to bottom. Counts carry across panels.</Hint>
    </div>
  )
}

export const wireSequences: ModuleDef = {
  id: 'wire-sequences',
  title: 'Wire Sequences',
  summary: 'Wires across panels, cut by occurrence',
  keywords: ['sequence', 'panels', 'abc', 'occurrence'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
