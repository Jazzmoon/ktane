import { useCallback } from 'react'
import { Store, useSelector } from '@tanstack/react-store'
import { emptyBomb } from '@/lib/bomb'
import { bombStore } from './bomb'
import { isRecord, persist } from './persist'

/** Per-module working state for the current bomb (inputs, history, …). */
export const sessionStore = new Store<Record<string, unknown>>({})

persist(sessionStore, {
  key: 'modules',
  storage: 'session',
  parse: (raw) => (isRecord(raw) ? raw : null),
})

/**
 * useState-like hook for a module's working state, persisted for the session
 * and cleared by "New bomb". Stored values that don't match the shape of
 * `initial` (e.g. after an update) fall back to `initial`.
 */
export function useModuleState<S>(id: string, initial: S) {
  const stored = useSelector(sessionStore, (s) => s[id])
  const state = sameShape(stored, initial) ? (stored as S) : initial

  const setState = useCallback(
    (next: S | ((prev: S) => S)) =>
      sessionStore.setState((all) => {
        const prev = sameShape(all[id], initial) ? (all[id] as S) : initial
        const value = typeof next === 'function' ? (next as (p: S) => S)(prev) : next
        return { ...all, [id]: value }
      }),
    [id, initial],
  )
  return [state, setState] as const
}

function sameShape(value: unknown, initial: unknown): boolean {
  if (value === undefined) return false
  if (Array.isArray(initial)) return Array.isArray(value)
  if (isRecord(initial)) return isRecord(value) && Object.keys(initial).every((k) => k in value)
  return typeof value === typeof initial
}

/** Clears a module's state, including sub-keys like `memory:notes`. */
export function resetModule(id: string) {
  sessionStore.setState((all) =>
    Object.fromEntries(Object.entries(all).filter(([k]) => k !== id && !k.startsWith(`${id}:`))),
  )
}

/** Clears bomb info and every module's working state. */
export function newBomb() {
  bombStore.setState(() => emptyBomb)
  sessionStore.setState(() => ({}))
}
