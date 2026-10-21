import type { Store } from '@tanstack/react-store'

type StorageKind = 'local' | 'session'

interface Persisted {
  restore(): void
}

const registry: Persisted[] = []
let restored = false

function storageOf(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null // private mode / blocked storage
  }
}

/**
 * Syncs a store with Web Storage. Nothing is read until `restorePersisted()`
 * runs after hydration, so the prerendered HTML and the first client render
 * always agree (no hydration mismatch).
 */
export function persist<T>(
  store: Store<T>,
  options: { key: string; storage: StorageKind; parse: (raw: unknown) => T | null },
): void {
  const key = `bbm:v1:${options.key}`
  registry.push({
    restore() {
      const storage = storageOf(options.storage)
      if (!storage) return
      try {
        const raw = storage.getItem(key)
        const value = raw === null ? null : options.parse(JSON.parse(raw))
        if (value !== null) store.setState(() => value)
      } catch {
        // corrupt or outdated entry: keep defaults
      }
      store.subscribe((value) => {
        try {
          storage.setItem(key, JSON.stringify(value))
        } catch {
          // quota / blocked: persistence is best-effort
        }
      })
    },
  })
}

/** Call once on the client after hydration. Idempotent. */
export function restorePersisted(): void {
  if (restored) return
  restored = true
  for (const p of registry) p.restore()
}

/** Test helper. */
export function resetPersistenceForTests(): void {
  restored = false
}

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
