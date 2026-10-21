/**
 * Edgework facts about the current bomb. Every field starts unknown (`null` or
 * an empty serial) and unknown is never treated as false/0: solvers ask for a
 * fact through `Facts`, and a missing one surfaces as a `need` result.
 */
export interface BombInfo {
  /** Serial as typed so far; complete at 6 characters. */
  serial: string
  batteries: number | null
  litCAR: boolean | null
  litFRK: boolean | null
  parallelPort: boolean | null
  strikes: 0 | 1 | 2 | null
}

export const SERIAL_LENGTH = 6

export const emptyBomb: BombInfo = {
  serial: '',
  batteries: null,
  litCAR: null,
  litFRK: null,
  parallelPort: null,
  strikes: null,
}

export type FactName = 'serialOdd' | 'serialVowel' | 'batteries' | 'litCAR' | 'litFRK' | 'parallelPort' | 'strikes'

export const FACT_LABELS: Record<FactName, string> = {
  serialOdd: 'serial number (last digit)',
  serialVowel: 'serial number (vowels)',
  batteries: 'battery count',
  litCAR: 'lit CAR indicator',
  litFRK: 'lit FRK indicator',
  parallelPort: 'parallel port',
  strikes: 'strike count',
}

export class MissingFact extends Error {
  constructor(readonly fact: FactName) {
    super(`Missing bomb fact: ${fact}`)
    this.name = 'MissingFact'
  }
}

export interface Facts {
  serialOdd(): boolean
  serialVowel(): boolean
  batteries(): number
  litCAR(): boolean
  litFRK(): boolean
  parallelPort(): boolean
  strikes(): 0 | 1 | 2
}

const VOWEL = /[AEIOU]/i

/** Facts derivable from the serial; `null` when not yet knowable. */
export function serialFacts(serial: string): {
  odd: boolean | null
  vowel: boolean | null
} {
  const complete = serial.length >= SERIAL_LENGTH
  const digits = serial.match(/\d/g)
  const last = digits?.at(-1)
  return {
    odd: complete && last !== undefined ? Number(last) % 2 === 1 : null,
    vowel: VOWEL.test(serial) ? true : complete ? false : null,
  }
}

function known<T>(value: T | null, fact: FactName): T {
  if (value === null) throw new MissingFact(fact)
  return value
}

export function factsOf(bomb: BombInfo): Facts {
  const serial = serialFacts(bomb.serial)
  return {
    serialOdd: () => known(serial.odd, 'serialOdd'),
    serialVowel: () => known(serial.vowel, 'serialVowel'),
    batteries: () => known(bomb.batteries, 'batteries'),
    litCAR: () => known(bomb.litCAR, 'litCAR'),
    litFRK: () => known(bomb.litFRK, 'litFRK'),
    parallelPort: () => known(bomb.parallelPort, 'parallelPort'),
    strikes: () => known(bomb.strikes, 'strikes'),
  }
}

export type Solution<T> = { kind: 'answer'; value: T } | { kind: 'need'; fact: FactName }

/**
 * Runs a rule with lazy access to bomb facts. Facts are only demanded on the
 * branch actually taken, so a rule never asks for info it doesn't need.
 */
export function solveWith<T>(bomb: BombInfo, rule: (facts: Facts) => T): Solution<T> {
  try {
    return { kind: 'answer', value: rule(factsOf(bomb)) }
  } catch (error) {
    if (error instanceof MissingFact) return { kind: 'need', fact: error.fact }
    throw error
  }
}
