import type { ReactNode } from 'react'
import { CircleHelp } from 'lucide-react'
import { FACT_LABELS, type FactName } from '@/lib/bomb'
import { cn } from '@/lib/utils'
import { requestFact } from '@/state/bomb'

/* ------------------------------------------------------------------ */
/* Segmented control                                                   */
/* ------------------------------------------------------------------ */

export interface SegmentOption<T extends string | number> {
  value: T
  label: ReactNode
  /** Accessible name when the label is not text. */
  title?: string
  disabled?: boolean
  className?: string
}

/**
 * Row of mutually exclusive buttons. With `allowDeselect`, tapping the active
 * option clears it (back to "unknown"). Touch targets are 44px on mobile.
 */
export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  allowDeselect = false,
  label,
  size = 'md',
  className,
}: {
  value: T | null
  options: readonly SegmentOption<T>[]
  onChange: (value: T | null) => void
  allowDeselect?: boolean
  label: string
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex rounded-lg border bg-muted/50 p-0.5 gap-0.5', className)}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={active}
            title={o.title}
            disabled={o.disabled}
            onClick={() => onChange(active && allowDeselect ? null : o.value)}
            className={cn(
              'inline-flex items-center justify-center rounded-md px-3 font-medium transition-colors',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
              'disabled:opacity-35 disabled:pointer-events-none',
              size === 'md' ? 'min-h-11 sm:min-h-9 text-sm' : 'min-h-9 sm:min-h-7 text-xs',
              active
                ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/60',
              o.className,
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Colour swatches                                                     */
/* ------------------------------------------------------------------ */

export const COLOR_CLASS: Record<string, string> = {
  red: 'bg-wire-red',
  blue: 'bg-wire-blue',
  yellow: 'bg-wire-yellow',
  white: 'bg-wire-white ring-1 ring-inset ring-black/15',
  black: 'bg-wire-black',
  green: 'bg-wire-green',
}

export const COLOR_TEXT: Record<string, string> = {
  red: 'text-wire-red',
  blue: 'text-wire-blue',
  yellow: 'text-wire-yellow',
  white: 'text-foreground',
  black: 'text-foreground',
  green: 'text-wire-green',
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function Swatch({ color, className }: { color: string; className?: string }) {
  return <span aria-hidden className={cn('inline-block size-3 shrink-0 rounded-full', COLOR_CLASS[color], className)} />
}

/** Big tap targets for adding a colour (wires, flashes, …). */
export function ColorPad<T extends string>({
  colors,
  onPick,
  label,
  disabled,
}: {
  colors: readonly T[]
  onPick: (c: T) => void
  label: string
  disabled?: boolean
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          disabled={disabled}
          onClick={() => onPick(c)}
          className={cn(
            'flex min-h-11 min-w-20 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium',
            'hover:bg-accent active:scale-[0.97] transition disabled:opacity-40 disabled:pointer-events-none',
            'focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
          )}
        >
          <Swatch color={c} className="size-4" />
          {cap(c)}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

const TONE = {
  go: 'border-go/40 bg-go-soft text-foreground [&_[data-title]]:text-go',
  stop: 'border-stop/40 bg-stop-soft text-foreground [&_[data-title]]:text-stop',
  pending: 'border-pending/50 bg-pending-soft text-foreground',
  info: 'border-border bg-muted/60 text-foreground',
} as const

export function Answer({
  tone = 'go',
  title,
  children,
  className,
}: {
  tone?: keyof typeof TONE
  title: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div role="status" aria-live="polite" className={cn('rounded-xl border px-4 py-3', TONE[tone], className)}>
      <div data-title className="text-lg font-semibold leading-tight sm:text-xl">
        {title}
      </div>
      {children && <div className="mt-1 text-sm text-muted-foreground">{children}</div>}
    </div>
  )
}

/** Shown instead of guessing when a rule depends on unknown edgework. */
export function NeedFact({ fact, className }: { fact: FactName; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => requestFact(fact)}
      className={cn(
        'flex w-full items-center gap-2 rounded-xl border border-dashed border-pending/60 bg-pending-soft px-4 py-3 text-left text-sm',
        'hover:border-pending focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
        className,
      )}
    >
      <CircleHelp className="size-4 shrink-0 text-pending" />
      <span>
        Need the <strong>{FACT_LABELS[fact]}</strong>. Tap to enter it.
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

export function Subhead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h4 className={cn('mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground', className)}>
      {children}
    </h4>
  )
}

/** Ordered rule list in manual style: first matching rule wins. */
export function RuleList({
  rules,
  className,
}: {
  rules: readonly { when: ReactNode; then: ReactNode; state?: 'struck' | 'active' }[]
  className?: string
}) {
  return (
    <ol className={cn('space-y-1.5 text-sm', className)}>
      {rules.map((r, i) => (
        <li
          key={i}
          className={cn(
            'flex gap-2 rounded-md px-2 py-1',
            r.state === 'struck' && 'text-muted-foreground line-through decoration-2 opacity-60',
            r.state === 'active' && 'bg-go-soft',
          )}
        >
          <span className="w-4 shrink-0 tabular-nums text-muted-foreground">{i + 1}.</span>
          <span className="flex-1">
            {r.when} <span className="text-muted-foreground">→</span>{' '}
            <strong className="font-semibold">{r.then}</strong>
          </span>
        </li>
      ))}
    </ol>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}
