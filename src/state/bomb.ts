import { Store } from '@tanstack/react-store'
import { emptyBomb, SERIAL_LENGTH, type BombInfo, type FactName } from '@/lib/bomb'
import { isRecord, persist } from './persist'

export const bombStore = new Store<BombInfo>(emptyBomb)

const triBool = (v: unknown) => (typeof v === 'boolean' ? v : null)

persist(bombStore, {
  key: 'bomb',
  storage: 'session',
  parse: (raw) => {
    if (!isRecord(raw)) return null
    const batteries = raw.batteries
    const strikes = raw.strikes
    return {
      serial: typeof raw.serial === 'string' ? raw.serial.slice(0, SERIAL_LENGTH) : '',
      batteries: typeof batteries === 'number' && batteries >= 0 ? Math.floor(batteries) : null,
      litCAR: triBool(raw.litCAR),
      litFRK: triBool(raw.litFRK),
      parallelPort: triBool(raw.parallelPort),
      strikes: strikes === 0 || strikes === 1 || strikes === 2 ? strikes : null,
    }
  },
})

export function updateBomb(patch: Partial<BombInfo>) {
  bombStore.setState((b) => ({ ...b, ...patch }))
}

/**
 * Lets a "Need: battery count" prompt ask the bomb-info UI to reveal and
 * focus the matching input. The counter makes repeated requests distinct.
 */
export const factFocusStore = new Store<{ fact: FactName | null; n: number }>({ fact: null, n: 0 })

export function requestFact(fact: FactName) {
  factFocusStore.setState((s) => ({ fact, n: s.n + 1 }))
}
