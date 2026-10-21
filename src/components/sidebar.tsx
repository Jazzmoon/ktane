import { Bomb, Monitor, Moon, Search, Sun } from 'lucide-react'
import { useSelector } from '@tanstack/react-store'
import { effectiveLevel } from '@/lib/assist'
import { cn } from '@/lib/utils'
import { MODULES } from '@/modules/registry'
import { supportedLevels } from '@/modules/types'
import { activeModuleStore, jumpToModule } from '@/state/active'
import { assistStore, DEFAULT_LEVEL, setCeiling } from '@/state/assist'
import { newBomb } from '@/state/session'
import { cycleTheme, themeStore } from '@/state/theme'
import { GlobalLevelPicker } from './level-picker'
import { Button } from './ui/button'

const DOT = { none: 'bg-muted-foreground/30', simplified: 'bg-pending', interactive: 'bg-go' } as const
const THEME_ICON = { system: Monitor, light: Sun, dark: Moon } as const

export function ThemeButton() {
  const theme = useSelector(themeStore)
  const Icon = THEME_ICON[theme]
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}. Change theme`}
      title={`Theme: ${theme}`}
    >
      <Icon />
    </Button>
  )
}

export function Sidebar({ onNavigate, onSearch }: { onNavigate?: () => void; onSearch: () => void }) {
  const active = useSelector(activeModuleStore)
  const assist = useSelector(assistStore)

  return (
    <nav aria-label="Modules" className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Bomb className="size-5" />
        <span className="font-semibold tracking-tight">Better Bomb Manual</span>
        <span className="ml-auto">
          <ThemeButton />
        </span>
      </div>

      <Button variant="outline" className="h-10 justify-start gap-2 text-muted-foreground" onClick={onSearch}>
        <Search /> Jump to…
        <kbd className="ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]">/</kbd>
      </Button>

      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Max assistance (all modules)
        </span>
        <GlobalLevelPicker value={assist.ceiling} onChange={setCeiling} />
      </div>

      <ol className="-mx-2 flex-1 space-y-0.5 overflow-y-auto">
        {MODULES.map((m) => {
          const level = effectiveLevel(assist.modules[m.id] ?? DEFAULT_LEVEL, assist.ceiling, supportedLevels(m))
          return (
            <li key={m.id}>
              <a
                href={`#${m.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onNavigate?.()
                  jumpToModule(m.id)
                }}
                aria-current={active === m.id ? 'location' : undefined}
                className={cn(
                  'flex min-h-10 items-center gap-2.5 rounded-md px-2 text-sm transition-colors lg:min-h-8',
                  active === m.id
                    ? 'bg-accent font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )}
              >
                <span className={cn('size-2 shrink-0 rounded-full', DOT[level])} title={`Assistance: ${level}`} />
                <span className="truncate">{m.title}</span>
                {m.needy && <span className="ml-auto text-[10px] uppercase tracking-wider opacity-60">needy</span>}
              </a>
            </li>
          )
        })}
      </ol>

      <Button variant="destructive" className="h-11 lg:h-9" onClick={newBomb}>
        <Bomb /> New bomb
      </Button>
    </nav>
  )
}
