export type KnobDirection = 'up' | 'down' | 'left' | 'right'

/**
 * The manual's eight LED configurations. Each string is a row of six LEDs,
 * "x" lit and "." unlit: [top row, bottom row].
 */
export const KNOB_CONFIGS: readonly { dir: KnobDirection; top: string; bottom: string }[] = [
  { dir: 'up', top: '..x.xx', bottom: 'xxxx.x' },
  { dir: 'up', top: 'x.x.x.', bottom: '.xx.xx' },
  { dir: 'down', top: '.xx..x', bottom: 'xxxx.x' },
  { dir: 'down', top: 'x.x.x.', bottom: '.x...x' },
  { dir: 'left', top: '....x.', bottom: 'x..xxx' },
  { dir: 'left', top: '....x.', bottom: '...xx.' },
  { dir: 'right', top: 'x.xxxx', bottom: 'xxx.x.' },
  { dir: 'right', top: 'x.xx..', bottom: 'xxx.x.' },
]
