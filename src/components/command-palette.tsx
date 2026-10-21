import { useEffect } from 'react'
import { Bomb, Gauge, Palette, SquareStack } from 'lucide-react'
import { useSelector } from '@tanstack/react-store'
import { LEVEL_LABELS, LEVELS } from '@/lib/assist'
import { MODULES } from '@/modules/registry'
import { supportedLevels } from '@/modules/types'
import { activeModuleStore, jumpToModule } from '@/state/active'
import { setCeiling, setModuleLevel } from '@/state/assist'
import { newBomb } from '@/state/session'
import { cycleTheme } from '@/state/theme'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './ui/command'

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const activeId = useSelector(activeModuleStore)
  const active = MODULES.find((m) => m.id === activeId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !isTyping(e.target))) {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenChange])

  const run = (fn: () => void) => () => {
    onOpenChange(false)
    // let the dialog close (and return focus) before scrolling / focusing
    requestAnimationFrame(fn)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Jump to a module"
      description="Search modules and actions"
    >
      <CommandInput placeholder="Module or action…" />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Modules">
          {MODULES.map((m) => (
            <CommandItem
              key={m.id}
              value={`${m.title} ${m.keywords.join(' ')}`}
              onSelect={run(() => jumpToModule(m.id))}
            >
              <SquareStack />
              <span>{m.title}</span>
              <span className="ml-2 truncate text-xs text-muted-foreground">{m.summary}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="new bomb reset clear" onSelect={run(newBomb)}>
            <Bomb /> New bomb
            <CommandShortcut>clears inputs</CommandShortcut>
          </CommandItem>
          {LEVELS.map((l) => (
            <CommandItem
              key={l}
              value={`assistance all global ${l} ${LEVEL_LABELS[l]}`}
              onSelect={run(() => setCeiling(l))}
            >
              <Gauge /> Max assistance: {LEVEL_LABELS[l]}
            </CommandItem>
          ))}
          {active &&
            supportedLevels(active)
              .filter(() => supportedLevels(active).length > 1)
              .map((l) => (
                <CommandItem
                  key={`m-${l}`}
                  value={`${active.title} assistance ${l} ${LEVEL_LABELS[l]}`}
                  onSelect={run(() => setModuleLevel(active.id, l))}
                >
                  <Gauge /> {active.title}: {LEVEL_LABELS[l]}
                </CommandItem>
              ))}
          <CommandItem value="theme dark light mode" onSelect={run(cycleTheme)}>
            <Palette /> Change theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
