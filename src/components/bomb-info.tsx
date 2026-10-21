import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, SlidersHorizontal } from 'lucide-react'
import { useSelector } from '@tanstack/react-store'
import { SERIAL_LENGTH, serialFacts, type BombInfo, type FactName } from '@/lib/bomb'
import { cn } from '@/lib/utils'
import { bombStore, factFocusStore, updateBomb } from '@/state/bomb'
import { Segmented } from './kit'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet'

const FIELD_FOR: Record<FactName, string> = {
  serialOdd: 'serial',
  serialVowel: 'serial',
  batteries: 'batteries',
  litCAR: 'car',
  litFRK: 'frk',
  parallelPort: 'parallel',
  strikes: 'strikes',
}

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const
const toYN = (v: boolean | null) => (v === null ? null : v ? 'yes' : 'no')
const fromYN = (v: 'yes' | 'no' | null) => (v === null ? null : v === 'yes')

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div data-field={id} className={cn('flex flex-col gap-1 rounded-md', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

/** All bomb-info inputs. Unknown is the default; tapping an active choice clears it. */
export function BombFields({ focus, className }: { focus?: FactName | null; className?: string }) {
  const bomb = useSelector(bombStore)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focus) return
    const field = root.current?.querySelector<HTMLElement>(`[data-field="${FIELD_FOR[focus]}"]`)
    const target = field?.querySelector<HTMLElement>('input, button')
    target?.focus()
    field?.classList.remove('flash')
    void field?.offsetWidth // restart animation
    field?.classList.add('flash')
  }, [focus])

  const { odd, vowel } = serialFacts(bomb.serial)

  return (
    <div ref={root} className={cn('flex flex-wrap items-start gap-x-5 gap-y-3', className)}>
      <Field id="serial" label="Serial">
        <Input
          aria-label="Serial number"
          value={bomb.serial}
          maxLength={SERIAL_LENGTH}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="e.g. AB3XY7"
          onChange={(e) => updateBomb({ serial: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
          className="h-11 w-32 font-mono text-base uppercase tracking-widest placeholder:text-sm placeholder:normal-case placeholder:tracking-normal placeholder:opacity-50 sm:h-9"
        />
        <span className="text-[11px] text-muted-foreground" aria-live="polite">
          {odd === null ? 'last digit ?' : odd ? 'odd' : 'even'} ·{' '}
          {vowel === null ? 'vowel ?' : vowel ? 'vowel' : 'no vowel'}
        </span>
      </Field>
      <Field id="batteries" label="Batteries">
        <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-10 sm:size-8"
            aria-label="Fewer batteries"
            onClick={() => updateBomb({ batteries: Math.max(0, (bomb.batteries ?? 1) - 1) })}
          >
            <Minus />
          </Button>
          <button
            type="button"
            aria-label={`Batteries: ${bomb.batteries ?? 'unknown'}. Tap to clear.`}
            onClick={() => updateBomb({ batteries: null })}
            className="w-8 text-center font-mono text-base font-semibold tabular-nums"
          >
            {bomb.batteries ?? '?'}
          </button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-10 sm:size-8"
            aria-label="More batteries"
            onClick={() => updateBomb({ batteries: (bomb.batteries ?? -1) + 1 })}
          >
            <Plus />
          </Button>
        </div>
      </Field>
      <Field id="car" label="Lit CAR">
        <Segmented
          label="Lit CAR indicator"
          size="sm"
          allowDeselect
          value={toYN(bomb.litCAR)}
          onChange={(v) => updateBomb({ litCAR: fromYN(v) })}
          options={YES_NO}
        />
      </Field>
      <Field id="frk" label="Lit FRK">
        <Segmented
          label="Lit FRK indicator"
          size="sm"
          allowDeselect
          value={toYN(bomb.litFRK)}
          onChange={(v) => updateBomb({ litFRK: fromYN(v) })}
          options={YES_NO}
        />
      </Field>
      <Field id="parallel" label="Parallel port">
        <Segmented
          label="Parallel port"
          size="sm"
          allowDeselect
          value={toYN(bomb.parallelPort)}
          onChange={(v) => updateBomb({ parallelPort: fromYN(v) })}
          options={YES_NO}
        />
      </Field>
      <Field id="strikes" label="Strikes">
        <Segmented
          label="Strikes"
          size="sm"
          allowDeselect
          value={bomb.strikes}
          onChange={(v) => updateBomb({ strikes: v })}
          options={[0, 1, 2].map((n) => ({ value: n as 0 | 1 | 2, label: n }))}
        />
      </Field>
    </div>
  )
}

export function summarize(b: BombInfo): string {
  const yn = (v: boolean | null, name: string) => (v === null ? null : v ? name : `no ${name}`)
  const parts = [
    b.serial ? `SN ${b.serial}` : 'SN ?',
    `🔋${b.batteries ?? '?'}`,
    yn(b.litCAR, 'CAR'),
    yn(b.litFRK, 'FRK'),
    yn(b.parallelPort, 'parallel'),
    b.strikes === null ? null : `✗${b.strikes}`,
  ]
  return parts.filter(Boolean).join(' · ')
}

/** Desktop: sticky bar above the modules. */
export function BombBarDesktop() {
  const request = useSelector(factFocusStore)
  return (
    <div className="sticky top-0 z-20 hidden border-b bg-background/85 backdrop-blur lg:block">
      <div className="mx-auto max-w-4xl px-6 py-3">
        <BombFields focus={request.fact} key={request.n} />
      </div>
    </div>
  )
}

/** Mobile: one-line summary pinned to the bottom; tap to edit in a sheet. */
export function BombBarMobile() {
  const bomb = useSelector(bombStore)
  const request = useSelector(factFocusStore)
  const [open, setOpen] = useState(false)

  // A "Need: …" prompt was tapped: open the sheet focused on that field.
  useEffect(() => {
    const sub = factFocusStore.subscribe(() => {
      if (!matchMedia('(min-width: 1024px)').matches) setOpen(true)
    })
    return () => sub.unsubscribe()
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-left backdrop-blur lg:hidden"
      >
        <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate font-mono text-sm">{summarize(bomb)}</span>
        <span className="text-sm font-medium text-primary">Edit</span>
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85dvh] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <SheetHeader className="pb-0">
            <SheetTitle>Bomb info</SheetTitle>
            <SheetDescription>Leave anything you don't know yet blank. Nothing is assumed.</SheetDescription>
          </SheetHeader>
          <BombFields focus={request.fact} key={request.n} className="px-4" />
          <div className="px-4">
            <Button className="h-11 w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
