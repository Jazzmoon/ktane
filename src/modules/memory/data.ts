export type Digit = 1 | 2 | 3 | 4
export type Stage = 1 | 2 | 3 | 4 | 5

/**
 * What to press, per stage and display digit:
 * - `pos`: the button in position n
 * - `label`: the button labelled n
 * - `samePos`: same position as pressed in stage n
 * - `sameLabel`: same label as pressed in stage n
 */
export type MemoryRule =
  | { kind: 'pos'; n: Digit }
  | { kind: 'label'; n: Digit }
  | { kind: 'samePos'; stage: Stage }
  | { kind: 'sameLabel'; stage: Stage }

const pos = (n: Digit): MemoryRule => ({ kind: 'pos', n })
const label = (n: Digit): MemoryRule => ({ kind: 'label', n })
const samePos = (stage: Stage): MemoryRule => ({ kind: 'samePos', stage })
const sameLabel = (stage: Stage): MemoryRule => ({ kind: 'sameLabel', stage })

/** MEMORY_RULES[stage - 1][display - 1] */
export const MEMORY_RULES: readonly (readonly [MemoryRule, MemoryRule, MemoryRule, MemoryRule])[] = [
  [pos(2), pos(2), pos(3), pos(4)],
  [label(4), samePos(1), pos(1), samePos(1)],
  [sameLabel(2), sameLabel(1), pos(3), label(4)],
  [samePos(1), pos(1), samePos(2), samePos(2)],
  [sameLabel(1), sameLabel(2), sameLabel(4), sameLabel(3)],
]

const ORD = ['1st', '2nd', '3rd', '4th']
export function describeRule(rule: MemoryRule): string {
  switch (rule.kind) {
    case 'pos':
      return `${ORD[rule.n - 1]} position`
    case 'label':
      return `Label "${rule.n}"`
    case 'samePos':
      return `Same position as stage ${rule.stage}`
    case 'sameLabel':
      return `Same label as stage ${rule.stage}`
  }
}
