import { Undo2 } from 'lucide-react'
import { Answer, cap, ColorPad, Hint, NeedFact, Subhead, Swatch } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { serialFacts } from '@/lib/bomb'
import { useBomb, useSolution } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { SIMON_COLORS, SIMON_TABLE, type SimonColor } from './data'
import { solveSimon } from './solve'

function Table({ vowel, strikes }: { vowel: boolean; strikes?: number | null }) {
  const rows = SIMON_TABLE[vowel ? 'vowel' : 'noVowel']
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] border-separate border-spacing-1 text-sm">
        <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Serial {vowel ? 'contains' : 'has no'} vowel
        </caption>
        <thead>
          <tr>
            <th className="text-left font-medium text-muted-foreground">Flash →</th>
            {SIMON_COLORS.map((c) => (
              <th key={c} className="font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <Swatch color={c} /> {cap(c)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, s) => (
            <tr key={s} className={cn(strikes === s && '[&>td]:bg-go-soft [&>th]:text-go')}>
              <th className="text-left font-medium text-muted-foreground">
                {s} strike{s === 1 ? '' : 's'}
              </th>
              {SIMON_COLORS.map((c) => (
                <td key={c} className="rounded-md bg-muted/50 py-1.5 text-center font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Swatch color={row[c]} /> {cap(row[c])}
                  </span>
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
    <div className="space-y-5">
      <Hint>Press the mapped colour for every flash in the sequence so far, in order.</Hint>
      <Table vowel />
      <Table vowel={false} />
    </div>
  )
}

function Simplified() {
  const bomb = useBomb()
  const { vowel } = serialFacts(bomb.serial)
  return (
    <div className="space-y-5">
      {vowel === null && <NeedFact fact="serialVowel" />}
      {bomb.strikes === null && <NeedFact fact="strikes" />}
      {vowel !== false && <Table vowel strikes={bomb.strikes} />}
      {vowel !== true && <Table vowel={false} strikes={bomb.strikes} />}
    </div>
  )
}

const INITIAL: SimonColor[] = []

function Interactive() {
  const [flashes, setFlashes] = useModuleState<SimonColor[]>('simon', INITIAL)
  const result = useSolution((f) => solveSimon(flashes, f))

  return (
    <div className="space-y-4">
      <div>
        <Subhead>Add the flashes in order</Subhead>
        <ColorPad label="Add flash" colors={SIMON_COLORS} onPick={(c) => setFlashes((p) => [...p, c])} />
      </div>
      {flashes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Flashes:</span>
          {flashes.map((c, i) => (
            <Swatch key={i} color={c} className="size-4" />
          ))}
          <Button variant="ghost" size="sm" onClick={() => setFlashes((p) => p.slice(0, -1))}>
            <Undo2 /> Undo
          </Button>
        </div>
      )}
      {result.kind === 'need' ? (
        <NeedFact fact={result.fact} />
      ) : (
        flashes.length > 0 && (
          <Answer title="Press">
            <ol className="mt-1 flex flex-wrap gap-2 text-foreground">
              {result.value.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 font-semibold">
                  <span className="text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  <Swatch color={c} className="size-4" /> {cap(c)}
                </li>
              ))}
            </ol>
          </Answer>
        )
      )}
      <Hint>Got a strike? Update strikes in bomb info; the answer updates.</Hint>
    </div>
  )
}

export const simon: ModuleDef = {
  id: 'simon',
  title: 'Simon Says',
  summary: 'Flashing colours, press the mapped sequence',
  keywords: ['simon', 'colours', 'flash', 'sequence'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
