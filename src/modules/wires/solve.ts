import type { Facts } from '@/lib/bomb'

export const WIRE_COLORS = ['red', 'blue', 'yellow', 'white', 'black'] as const
export type Wire = (typeof WIRE_COLORS)[number]

export interface WireCut {
  /** 1-based position of the wire to cut. */
  cut: number
  rule: string
}

const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
export const ordinal = (n: number) => ORDINAL[n - 1] ?? `#${n}`

/** Simple Wires, manual section "On the Subject of Wires". */
export function solveWires(wires: readonly Wire[], f: Facts): WireCut {
  const count = (c: Wire) => wires.filter((w) => w === c).length
  const last = wires.at(-1)
  const lastOf = (c: Wire) => wires.lastIndexOf(c) + 1
  const n = wires.length

  switch (n) {
    case 3:
      if (count('red') === 0) return { cut: 2, rule: 'No red wires' }
      if (last === 'white') return { cut: 3, rule: 'Last wire is white' }
      if (count('blue') > 1) return { cut: lastOf('blue'), rule: 'More than one blue wire' }
      return { cut: 3, rule: 'Otherwise' }
    case 4:
      if (count('red') > 1 && f.serialOdd())
        return { cut: lastOf('red'), rule: 'More than one red wire and serial is odd' }
      if (last === 'yellow' && count('red') === 0) return { cut: 1, rule: 'Last wire is yellow and no red wires' }
      if (count('blue') === 1) return { cut: 1, rule: 'Exactly one blue wire' }
      if (count('yellow') > 1) return { cut: 4, rule: 'More than one yellow wire' }
      return { cut: 2, rule: 'Otherwise' }
    case 5:
      if (last === 'black' && f.serialOdd()) return { cut: 4, rule: 'Last wire is black and serial is odd' }
      if (count('red') === 1 && count('yellow') > 1)
        return { cut: 1, rule: 'Exactly one red wire and more than one yellow wire' }
      if (count('black') === 0) return { cut: 2, rule: 'No black wires' }
      return { cut: 1, rule: 'Otherwise' }
    case 6:
      if (count('yellow') === 0 && f.serialOdd()) return { cut: 3, rule: 'No yellow wires and serial is odd' }
      if (count('yellow') === 1 && count('white') > 1)
        return { cut: 4, rule: 'Exactly one yellow wire and more than one white wire' }
      if (count('red') === 0) return { cut: 6, rule: 'No red wires' }
      return { cut: 4, rule: 'Otherwise' }
    default:
      throw new RangeError(`Simple Wires has 3–6 wires, got ${n}`)
  }
}
