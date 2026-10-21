import { KNOB_CONFIGS, type KnobDirection } from './data'

/** The six left-hand LEDs (3 top, 3 bottom) are enough to tell every config apart. */
export function leftHalf(top: readonly boolean[], bottom: readonly boolean[]): boolean[] {
  return [...top.slice(0, 3), ...bottom.slice(0, 3)]
}

const key = (leds: readonly boolean[]) => leds.map((l) => (l ? 'x' : '.')).join('')

const BY_LEFT = new Map<string, KnobDirection>(
  KNOB_CONFIGS.map((c) => [c.top.slice(0, 3) + c.bottom.slice(0, 3), c.dir]),
)

/** leds: [top-left 3, bottom-left 3] */
export function solveKnob(leds: readonly boolean[]): KnobDirection | null {
  return BY_LEFT.get(key(leds)) ?? null
}
