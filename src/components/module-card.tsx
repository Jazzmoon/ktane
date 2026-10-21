import { RotateCcw } from 'lucide-react'
import { useSelector } from '@tanstack/react-store'
import { effectiveLevel, isCapped, LEVEL_LABELS } from '@/lib/assist'
import { cn } from '@/lib/utils'
import { supportedLevels, type ModuleDef } from '@/modules/types'
import { assistStore, DEFAULT_LEVEL, setModuleLevel } from '@/state/assist'
import { resetModule } from '@/state/session'
import { LevelPicker } from './level-picker'
import { Button } from './ui/button'

export function useModuleLevels(def: ModuleDef) {
  const setting = useSelector(assistStore, (s) => s.modules[def.id] ?? DEFAULT_LEVEL)
  const ceiling = useSelector(assistStore, (s) => s.ceiling)
  const supported = supportedLevels(def)
  return {
    setting,
    ceiling,
    supported,
    effective: effectiveLevel(setting, ceiling, supported),
  }
}

export function ModuleCard({ def }: { def: ModuleDef }) {
  const { setting, ceiling, supported, effective } = useModuleLevels(def)
  const View = def.views[effective] ?? def.views.none
  const capped = isCapped(setting, ceiling) && effective !== setting

  return (
    <section
      id={def.id}
      aria-labelledby={`${def.id}-title`}
      data-module
      className="scroll-mt-18 rounded-2xl lg:scroll-mt-32 border bg-card text-card-foreground shadow-xs"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-4 py-3 sm:px-5">
        <h2 id={`${def.id}-title`} className="mr-auto text-lg font-semibold tracking-tight">
          {def.title}
          {def.needy && (
            <span className="ml-2 align-middle text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Needy
            </span>
          )}
        </h2>
        {supported.length > 1 && (
          <div className="order-last w-full sm:order-none sm:w-auto [&>div]:w-full sm:[&>div]:w-auto [&>div>button]:flex-1">
            <LevelPicker
              label={`${def.title} assistance`}
              value={setting}
              ceiling={ceiling}
              supported={supported}
              onChange={(l) => setModuleLevel(def.id, l)}
            />
          </div>
        )}
        {def.stateful && effective !== 'none' && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-11 sm:size-8"
            onClick={() => resetModule(def.id)}
            aria-label={`Reset ${def.title}`}
            title="Reset this module"
          >
            <RotateCcw />
          </Button>
        )}
      </header>
      {capped && (
        <p className="border-b bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground sm:px-5">
          Showing {LEVEL_LABELS[effective]}: capped by global assistance.
        </p>
      )}
      <div className={cn('px-4 py-4 sm:px-5')}>
        <View />
      </div>
    </section>
  )
}
