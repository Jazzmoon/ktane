import { LEVEL_DESCRIPTIONS, LEVEL_LABELS, LEVELS, isCapped, type Level } from '@/lib/assist'
import { cn } from '@/lib/utils'
import { Segmented } from './kit'

const SHORT: Record<Level, string> = { none: 'Off', simplified: 'Simple', interactive: 'Solver' }

/**
 * A module's own assistance setting. Levels the module doesn't offer are
 * hidden; levels above the global ceiling stay selectable (it's a preference)
 * but are dimmed with a "capped" hint so it's clear why help is off.
 */
export function LevelPicker({
  value,
  ceiling,
  supported,
  onChange,
  label,
}: {
  value: Level
  ceiling: Level
  supported: readonly Level[]
  onChange: (l: Level) => void
  label: string
}) {
  return (
    <Segmented
      size="sm"
      label={label}
      value={value}
      onChange={(l) => l && onChange(l)}
      options={LEVELS.filter((l) => supported.includes(l)).map((l) => {
        const capped = isCapped(l, ceiling)
        return {
          value: l,
          label: SHORT[l],
          title: `${LEVEL_LABELS[l]}: ${LEVEL_DESCRIPTIONS[l]}${capped ? ' (capped by global assistance)' : ''}`,
          className: cn(capped && 'opacity-50 italic'),
        }
      })}
    />
  )
}

export function GlobalLevelPicker({ value, onChange }: { value: Level; onChange: (l: Level) => void }) {
  return (
    <Segmented
      label="Global assistance ceiling"
      value={value}
      onChange={(l) => l && onChange(l)}
      className="w-full [&>button]:flex-1"
      options={LEVELS.map((l) => ({
        value: l,
        label: SHORT[l],
        title: `Allow at most: ${LEVEL_LABELS[l]}`,
      }))}
    />
  )
}
