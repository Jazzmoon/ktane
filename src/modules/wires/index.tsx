import { X } from 'lucide-react'
import { Answer, cap, ColorPad, Hint, NeedFact, RuleList, Subhead, Swatch } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { serialFacts } from '@/lib/bomb'
import { useBomb, useSolution } from '@/lib/hooks'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { ordinal, solveWires, WIRE_COLORS, type Wire } from './solve'

/** Display copy of the rules. `serial` marks rules gated on an odd serial. */
const RULES: Record<number, { when: string; then: string; serial?: boolean }[]> = {
  3: [
    { when: 'No red wires', then: 'Cut the second wire' },
    { when: 'Last wire is white', then: 'Cut the last wire' },
    { when: 'More than one blue wire', then: 'Cut the last blue wire' },
    { when: 'Otherwise', then: 'Cut the last wire' },
  ],
  4: [
    { when: 'More than one red wire and serial is odd', then: 'Cut the last red wire', serial: true },
    { when: 'Last wire is yellow and there are no red wires', then: 'Cut the first wire' },
    { when: 'Exactly one blue wire', then: 'Cut the first wire' },
    { when: 'More than one yellow wire', then: 'Cut the last wire' },
    { when: 'Otherwise', then: 'Cut the second wire' },
  ],
  5: [
    { when: 'Last wire is black and serial is odd', then: 'Cut the fourth wire', serial: true },
    { when: 'Exactly one red wire and more than one yellow wire', then: 'Cut the first wire' },
    { when: 'No black wires', then: 'Cut the second wire' },
    { when: 'Otherwise', then: 'Cut the first wire' },
  ],
  6: [
    { when: 'No yellow wires and serial is odd', then: 'Cut the third wire', serial: true },
    { when: 'Exactly one yellow wire and more than one white wire', then: 'Cut the fourth wire' },
    { when: 'No red wires', then: 'Cut the last wire' },
    { when: 'Otherwise', then: 'Cut the fourth wire' },
  ],
}

function RuleGrid({ serialOdd }: { serialOdd?: boolean | null }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {[3, 4, 5, 6].map((n) => (
        <div key={n}>
          <Subhead>{n} wires</Subhead>
          <RuleList
            rules={RULES[n]!.map((r) => {
              if (!r.serial || serialOdd == null) return r
              return serialOdd
                ? { when: r.when.replace(' and serial is odd', ''), then: r.then, state: 'active' as const }
                : { ...r, state: 'struck' as const }
            })}
          />
        </div>
      ))}
    </div>
  )
}

function None() {
  return (
    <>
      <Hint>Count the wires, then use the first rule that applies. Positions count from the top.</Hint>
      <div className="mt-4">
        <RuleGrid />
      </div>
    </>
  )
}

function Simplified() {
  const { odd } = serialFacts(useBomb().serial)
  return (
    <>
      <Hint>
        {odd === null
          ? 'Enter the serial number to resolve the serial-odd rules.'
          : odd
            ? 'Serial is odd: those rules apply (highlighted).'
            : 'Serial is even: those rules are struck out.'}
      </Hint>
      <div className="mt-4">
        <RuleGrid serialOdd={odd} />
      </div>
    </>
  )
}

const INITIAL: Wire[] = []

function Interactive() {
  const [wires, setWires] = useModuleState<Wire[]>('wires', INITIAL)
  const result = useSolution((f) => (wires.length >= 3 ? solveWires(wires, f) : null))

  return (
    <div className="space-y-4">
      <div>
        <Subhead>Add wires top to bottom</Subhead>
        <ColorPad
          label="Add wire"
          colors={WIRE_COLORS}
          disabled={wires.length >= 6}
          onPick={(c) => setWires((w) => [...w, c])}
        />
      </div>
      {wires.length > 0 && (
        <ol className="space-y-1.5" aria-label="Wires">
          {wires.map((w, i) => {
            const isCut = result.kind === 'answer' && result.value?.cut === i + 1
            return (
              <li key={i} className="flex items-center gap-3">
                <span className="w-5 text-right text-sm tabular-nums text-muted-foreground">{i + 1}</span>
                <span
                  className={`h-3 flex-1 rounded-full ${isCut ? 'ring-2 ring-go ring-offset-2 ring-offset-card' : ''}`}
                  style={{
                    background: `var(--wire-${w})`,
                    boxShadow: w === 'white' ? 'inset 0 0 0 1px rgb(0 0 0 / .15)' : undefined,
                  }}
                  aria-label={`${cap(w)}${isCut ? ', cut this one' : ''}`}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-9"
                  aria-label={`Remove wire ${i + 1}`}
                  onClick={() => setWires((ws) => ws.filter((_, j) => j !== i))}
                >
                  <X />
                </Button>
              </li>
            )
          })}
        </ol>
      )}
      {wires.length < 3 ? (
        <Hint>Simple Wires has 3 to 6 wires.</Hint>
      ) : result.kind === 'need' ? (
        <NeedFact fact={result.fact} />
      ) : (
        result.value && (
          <Answer title={`Cut the ${ordinal(result.value.cut)} wire`}>
            <span className="inline-flex items-center gap-1.5">
              <Swatch color={wires[result.value.cut - 1]!} /> {cap(wires[result.value.cut - 1]!)} · {result.value.rule}
            </span>
          </Answer>
        )
      )}
    </div>
  )
}

export const wires: ModuleDef = {
  id: 'wires',
  title: 'Simple Wires',
  summary: '3–6 coloured wires, cut one',
  keywords: ['wire', 'cut', 'simple'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
