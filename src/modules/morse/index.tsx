import { useState } from 'react'
import { Delete } from 'lucide-react'
import { Answer, Hint, Subhead } from '@/components/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useModuleState } from '@/state/session'
import type { ModuleDef } from '../types'
import { MORSE, MORSE_WORDS } from './data'
import { candidates, decode } from './solve'

const pretty = (code: string) => code.replaceAll('.', '•').replaceAll('-', '−')

function Alphabet() {
  return (
    <ul className="grid grid-cols-3 gap-x-4 gap-y-1 font-mono text-sm sm:grid-cols-6">
      {Object.entries(MORSE)
        .filter(([k]) => /[A-Z]/.test(k))
        .map(([letter, code]) => (
          <li key={letter} className="flex justify-between border-b py-0.5">
            <span className="font-semibold">{letter}</span>
            <span className="tracking-widest">{pretty(code)}</span>
          </li>
        ))}
    </ul>
  )
}

function WordTable({ words, highlight }: { words: typeof MORSE_WORDS; highlight?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
      {words.map((w) => (
        <li
          key={w.word}
          className={cn('flex justify-between rounded px-1.5 py-0.5', highlight && 'bg-go-soft font-semibold')}
        >
          <span className="font-mono">{w.word}</span>
          <span className="tabular-nums">{w.mhz}</span>
        </li>
      ))}
    </ul>
  )
}

function None() {
  return (
    <div className="space-y-5">
      <Hint>Decode the looping word from the flashing light, then transmit at its frequency (MHz).</Hint>
      <Alphabet />
      <WordTable words={MORSE_WORDS} />
    </div>
  )
}

function Simplified() {
  const [letters, setLetters] = useState('')
  const hits = candidates(letters)
  return (
    <div className="space-y-4">
      <Alphabet />
      <div>
        <Subhead>Letters decoded so far</Subhead>
        <Input
          value={letters}
          onChange={(e) => setLetters(e.target.value.replace(/[^a-z]/gi, ''))}
          placeholder="e.g. bri"
          className="h-11 w-48 font-mono sm:h-9"
          aria-label="Letters decoded so far"
        />
      </div>
      <WordTable words={hits} highlight={hits.length === 1} />
      {hits.length === 0 && <Answer tone="stop" title="No word matches" />}
    </div>
  )
}

interface State {
  letters: string
  current: string
}
const INITIAL: State = { letters: '', current: '' }

function Interactive() {
  const [s, set] = useModuleState<State>('morse', INITIAL)
  const hits = candidates(s.letters)
  const pending = s.current ? decode(s.current) : undefined
  const tap = (sym: '.' | '-') => set((p) => ({ ...p, current: (p.current + sym).slice(0, 5) }))
  const commit = () =>
    set((p) => {
      const l = decode(p.current)
      return l ? { letters: p.letters + l.toLowerCase(), current: '' } : p
    })
  const back = () =>
    set((p) => (p.current ? { ...p, current: p.current.slice(0, -1) } : { ...p, letters: p.letters.slice(0, -1) }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex gap-2">
          <Button variant="outline" className="h-14 w-16 text-3xl" onClick={() => tap('.')} aria-label="Dot">
            •
          </Button>
          <Button variant="outline" className="h-14 w-16 text-3xl" onClick={() => tap('-')} aria-label="Dash">
            −
          </Button>
          <Button className="h-14 px-4" onClick={commit} disabled={!pending}>
            Letter{pending ? `: ${pending}` : ''}
          </Button>
          <Button variant="ghost" className="h-14" onClick={back} aria-label="Backspace">
            <Delete />
          </Button>
        </div>
      </div>
      <div className="flex min-h-10 items-center gap-3 rounded-lg border bg-muted/40 px-3 font-mono text-lg">
        <span className="uppercase tracking-widest">
          {s.letters || <span className="text-muted-foreground">…</span>}
        </span>
        {s.current && <span className="text-muted-foreground">{pretty(s.current)}</span>}
      </div>
      <Hint>Tap the signal, press Letter at each gap. You can start mid-word; the word loops.</Hint>
      {hits.length === 1 ? (
        <Answer title={`Transmit ${hits[0]!.mhz} MHz`}>Word: {hits[0]!.word}</Answer>
      ) : hits.length === 0 ? (
        <Answer tone="stop" title="No word matches">
          Clear and listen again.
        </Answer>
      ) : (
        <WordTable words={hits} />
      )}
    </div>
  )
}

export const morse: ModuleDef = {
  id: 'morse',
  title: 'Morse Code',
  summary: 'Decode a flashing word, transmit a frequency',
  keywords: ['morse', 'frequency', 'light', 'mhz', 'radio'],
  stateful: true,
  views: { none: None, simplified: Simplified, interactive: Interactive },
}
