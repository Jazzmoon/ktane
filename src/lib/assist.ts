export const LEVELS = ['none', 'simplified', 'interactive'] as const
export type Level = (typeof LEVELS)[number]

export const LEVEL_LABELS: Record<Level, string> = {
  none: 'None',
  simplified: 'Simplified',
  interactive: 'Interactive',
}

export const LEVEL_DESCRIPTIONS: Record<Level, string> = {
  none: 'Plain manual, no help',
  simplified: 'Condensed rules that react to bomb info',
  interactive: 'Enter what you see, get the answer',
}

const rank = (level: Level) => LEVELS.indexOf(level)

/**
 * The level a module actually renders at: the highest level it supports that
 * is no higher than both its own setting and the global ceiling.
 */
export function effectiveLevel(
  setting: Level,
  ceiling: Level,
  supported: readonly Level[],
): Level {
  const cap = Math.min(rank(setting), rank(ceiling))
  for (let i = cap; i >= 0; i--) {
    const level = LEVELS[i]!
    if (supported.includes(level)) return level
  }
  return 'none'
}

/** True when the global ceiling is what's holding the module back. */
export function isCapped(setting: Level, ceiling: Level): boolean {
  return rank(ceiling) < rank(setting)
}

export function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as readonly string[]).includes(value)
}
