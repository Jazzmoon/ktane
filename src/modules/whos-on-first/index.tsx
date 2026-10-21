import { useState } from 'react'
import { Answer, Hint, Subhead } from '@/components/kit'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { DISPLAY_WORDS, LABEL_WORDS, POSITION_NAMES, POSITIONS, STEP1, STEP2, type Position } from './data'
import { matchWords, readPosition } from './solve'

const show = (w: string) => (w === '' ? '(empty)' : w)

function MiniModule({ highlight }: { highlight: Position }) {
  return (
    <div className="inline-grid grid-cols-2 gap-1 rounded-lg border bg-muted/50 p-1.5" aria-hidden>
      {POSITIONS.map((p) => (
        <span key={p} className={cn('h-5 w-9 rounded-sm bg-background', p === highlight && 'bg-go ring-2 ring-go')} />
      ))}
    </div>
  )
}

function Step1Table({ filter = '' }: { filter?: string }) {
  const words = filter ? matchWords(filter, DISPLAY_WORDS) : DISPLAY_WORDS
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3 lg:grid-cols-4">
      {words.map((w) => (
        <li key={w} className="flex justify-between gap-2 border-b py-1">
          <span className="font-mono">{show(w)}</span>
          <span className="font-semibold">{STEP1[w]}</span>
        </li>
      ))}
    </ul>
  )
}

function Step2Lists({ filter = '' }: { filter?: string }) {
  const words = filter ? matchWords(filter, LABEL_WORDS) : LABEL_WORDS
  return (
    <dl className="space-y-2 text-sm">
      {words.map((w) => (
        <div key={w} className="grid gap-1 border-b pb-2 sm:grid-cols-[7rem_1fr]">
          <dt className="font-mono font-semibold">{w}</dt>
          <dd className="text-muted-foreground">{STEP2[w]!.join(', ')}</dd>
        </div>
      ))}
    </dl>
  )
}

function None() {
  return (
    <div className="space-y-5">
      <div>
        <Subhead>Step 1: read the display, then read the label of this button</Subhead>
        <Hint>TL/TR = top, ML/MR = middle, BL/BR = bottom row.</Hint>
        <div className="mt-2">
          <Step1Table />
        </div>
      </div>
      <div>
        <Subhead>Step 2: press the first word in that label's list that's on the module</Subhead>
        <Step2Lists />
      </div>
    </div>
  )
}

function Simplified() {
  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState('')
  return (
    <div className="space-y-5">
      <div>
        <Subhead>Step 1: display word</Subhead>
        <Input
          value={q1}
          onChange={(e) => setQ1(e.target.value)}
          placeholder="Search display…"
          className="mb-2 h-11 sm:h-9"
        />
        <Step1Table filter={q1} />
      </div>
      <div>
        <Subhead>Step 2: button label</Subhead>
        <Input
          value={q2}
          onChange={(e) => setQ2(e.target.value)}
          placeholder="Search label…"
          className="mb-2 h-11 sm:h-9"
        />
        <Step2Lists filter={q2} />
      </div>
    </div>
  )
}

/** Search box + tappable word chips. Exact/only match can be picked with Enter. */
function WordPicker({
  words,
  value,
  onPick,
  label,
}: {
  words: readonly string[]
  value: string | null
  onPick: (w: string | null) => void
  label: string
}) {
  const [q, setQ] = useState('')
  const hits = matchWords(q, words)
  return (
    <div className="space-y-2">
      <Input
        aria-label={label}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && hits[0] !== undefined) {
            onPick(hits[0])
            setQ('')
          }
        }}
        placeholder="Type to filter, Enter picks the first"
        className="h-11 sm:h-9"
      />
      <div className="flex flex-wrap gap-1.5">
        {hits.map((w) => (
          <button
            key={w}
            type="button"
            aria-pressed={value === w}
            onClick={() => {
              onPick(value === w ? null : w)
              setQ('')
            }}
            className={cn(
              'min-h-10 rounded-md border px-2.5 font-mono text-sm transition sm:min-h-8',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
              value === w ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-accent',
            )}
          >
            {show(w)}
          </button>
        ))}
      </div>
    </div>
  )
}

interface State {
  display: string | null
  label: string | null
}
const INITIAL: State = { display: null, label: null }

function Interactive() {
  const [s, set] = useModuleState<State>('whos-on-first', INITIAL)
  const pos = s.display === null ? undefined : readPosition(s.display)
  return (
    <div className="space-y-5">
      <div>
        <Subhead>1 · What's on the display?</Subhead>
        <WordPicker
          label="Display word"
          words={DISPLAY_WORDS}
          value={s.display}
          onPick={(display) => set((p) => ({ ...p, display }))}
        />
        {pos && (
          <Answer
            className="mt-3"
            title={
              <span className="flex items-center gap-3">
                <MiniModule highlight={pos} /> Read the {POSITION_NAMES[pos].toLowerCase()} button
              </span>
            }
          />
        )}
      </div>
      <div>
        <Subhead>2 · What does that button say?</Subhead>
        <WordPicker
          label="Button label"
          words={LABEL_WORDS}
          value={s.label}
          onPick={(label) => set((p) => ({ ...p, label }))}
        />
        {s.label && (
          <Answer className="mt-3" title="Press the first of these that's on the module">
            <ol className="mt-1 flex flex-wrap gap-1.5 font-mono text-foreground">
              {STEP2[s.label]!.map((w, i) => (
                <li key={w} className="rounded border bg-card px-2 py-0.5">
                  <span className="mr-1 text-xs text-muted-foreground">{i + 1}</span>
                  {w}
                </li>
              ))}
            </ol>
          </Answer>
        )}
      </div>
      <Hint>The module repeats three times; change the picks for each round.</Hint>
    </div>
  )
}

export const whosOnFirst: ModuleDef = {
  id: 'whos-on-first',
  title: "Who's on First",
  summary: 'Display word → button to read → word to press',
  keywords: ['wof', 'words', 'display', 'first', 'who'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
