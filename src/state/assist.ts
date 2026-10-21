import { Store } from '@tanstack/react-store'
import { isLevel, type Level } from '@/lib/assist'
import { isRecord, persist } from './persist'

export interface AssistState {
  ceiling: Level
  /** Per-module setting; absent means the default (interactive). */
  modules: Record<string, Level>
}

export const DEFAULT_LEVEL: Level = 'interactive'

export const assistStore = new Store<AssistState>({ ceiling: 'interactive', modules: {} })

persist(assistStore, {
  key: 'assist',
  storage: 'local',
  parse: (raw) => {
    if (!isRecord(raw) || !isLevel(raw.ceiling)) return null
    const modules: Record<string, Level> = {}
    if (isRecord(raw.modules))
      for (const [id, level] of Object.entries(raw.modules)) if (isLevel(level)) modules[id] = level
    return { ceiling: raw.ceiling, modules }
  },
})

export function setCeiling(ceiling: Level) {
  assistStore.setState((s) => ({ ...s, ceiling }))
}

export function setModuleLevel(id: string, level: Level) {
  assistStore.setState((s) => ({ ...s, modules: { ...s.modules, [id]: level } }))
}

export function setAllModuleLevels(ids: readonly string[], level: Level) {
  assistStore.setState((s) => ({
    ...s,
    modules: { ...s.modules, ...Object.fromEntries(ids.map((id) => [id, level])) },
  }))
}
