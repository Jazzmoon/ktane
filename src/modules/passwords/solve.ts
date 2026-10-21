import { PASSWORDS } from './data'

/** Passwords matching the letters available in each column (empty = unknown). */
export function filterPasswords(columns: readonly string[]): string[] {
  const sets = columns.map((c) => new Set(c.toLowerCase().replace(/[^a-z]/g, '')))
  return PASSWORDS.filter((word) =>
    sets.every((set, i) => set.size === 0 || set.has(word[i]!)),
  )
}
