import type { ComponentType } from 'react'
import type { Level } from '@/lib/assist'

export interface ModuleDef {
  /** Also the DOM anchor: /#<id>. */
  id: string
  title: string
  /** One line shown in the palette. */
  summary: string
  /** Extra palette search terms. */
  keywords: string[]
  needy?: boolean
  /** Whether the module keeps per-bomb working state (shows a reset button). */
  stateful?: boolean
  views: { none: ComponentType } & Partial<Record<Exclude<Level, 'none'>, ComponentType>>
}

export function supportedLevels(def: ModuleDef): Level[] {
  return (['none', 'simplified', 'interactive'] as const).filter((l) => def.views[l])
}
