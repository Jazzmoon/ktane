import type { Facts } from '@/lib/bomb'

export const BUTTON_COLORS = ['red', 'blue', 'yellow', 'white'] as const
export type ButtonColor = (typeof BUTTON_COLORS)[number]
export const BUTTON_LABELS = ['abort', 'detonate', 'hold', 'press'] as const
export type ButtonLabel = (typeof BUTTON_LABELS)[number]
export const STRIP_COLORS = ['blue', 'white', 'yellow', 'red'] as const
export type StripColor = (typeof STRIP_COLORS)[number]

export interface ButtonAction {
  action: 'tap' | 'hold'
  rule: string
}

/** The Button, manual section "On the Subject of The Button". Rules apply in order. */
export function solveButton(color: ButtonColor, label: ButtonLabel, f: Facts): ButtonAction {
  if (color === 'blue' && label === 'abort') return { action: 'hold', rule: 'Blue + "Abort"' }
  if (label === 'detonate' && f.batteries() > 1)
    return { action: 'tap', rule: 'More than 1 battery + "Detonate"' }
  if (color === 'white' && f.litCAR()) return { action: 'hold', rule: 'White + lit CAR' }
  if (f.batteries() > 2 && f.litFRK())
    return { action: 'tap', rule: 'More than 2 batteries + lit FRK' }
  if (color === 'yellow') return { action: 'hold', rule: 'Yellow' }
  if (color === 'red' && label === 'hold') return { action: 'tap', rule: 'Red + "Hold"' }
  return { action: 'hold', rule: 'Otherwise' }
}

/** Release when the countdown timer shows this digit in any position. */
export function releaseDigit(strip: StripColor): number {
  switch (strip) {
    case 'blue':
      return 4
    case 'yellow':
      return 5
    default:
      return 1
  }
}
