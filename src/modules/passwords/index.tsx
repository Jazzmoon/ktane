import { useState } from 'react'
import { Answer, Hint, Subhead } from '@/components/kit'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { PASSWORDS } from './data'
import { filterPasswords } from './solve'

function Words({ words, highlight }: { words: readonly string[]; highlight?: boolean }) {
  return (
    <ul className="grid grid-cols-3 gap-1.5 font-mono text-sm uppercase sm:grid-cols-5">
      {words.map((w) => (
        <li
          key={w}
          className={cn('rounded-md bg-muted/50 py-1.5 text-center', highlight && 'bg-go-soft font-bold text-go')}
        >
          {w}
        </li>
      ))}
    </ul>
  )
}

function None() {
  return (
    <div className="space-y-3">
      <Hint>Cycle each column's letters until the five spell one of these words, then press submit.</Hint>
      <Words words={PASSWORDS} />
    </div>
  )
}

function Simplified() {
  const [first, setFirst] = useState('')
  const words = filterPasswords([first])
  return (
    <div className="space-y-3">
      <Subhead>Letters in the first column</Subhead>
      <Input
        aria-label="First column letters"
        value={first}
        maxLength={6}
        onChange={(e) => setFirst(e.target.value)}
        placeholder="ALNTW"
        className="h-11 w-40 font-mono uppercase sm:h-9"
      />
      <Words words={words} highlight={words.length === 1} />
    </div>
  )
}

const INITIAL = ['', '', '', '', '']

function Interactive() {
  const [cols, setCols] = useModuleState<string[]>('passwords', INITIAL)
  const words = filterPasswords(cols)
  return (
    <div className="space-y-4">
      <div>
        <Subhead>Letters available in each column</Subhead>
        <div className="grid grid-cols-5 gap-1.5 sm:max-w-md">
          {cols.map((c, i) => (
            <Input
              key={i}
              aria-label={`Column ${i + 1} letters`}
              value={c}
              maxLength={6}
              autoCapitalize="characters"
              onChange={(e) => setCols((p) => p.map((x, j) => (j === i ? e.target.value.replace(/[^a-z]/gi, '') : x)))}
              className="h-11 px-1.5 text-center font-mono uppercase sm:h-9"
              placeholder={String(i + 1)}
            />
          ))}
        </div>
        <Hint>Usually two or three columns are enough.</Hint>
      </div>
      {words.length === 1 ? (
        <Answer title={<span className="font-mono uppercase tracking-widest">{words[0]}</span>}>
          Set the columns and press submit.
        </Answer>
      ) : words.length === 0 ? (
        <Answer tone="stop" title="No password matches">
          Check the letters entered.
        </Answer>
      ) : (
        <Words words={words} />
      )}
    </div>
  )
}

export const passwords: ModuleDef = {
  id: 'passwords',
  title: 'Passwords',
  summary: 'Spin letter columns into a word',
  keywords: ['password', 'letters', 'columns', 'word'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
