import { button } from './button'
import { capacitor } from './capacitor'
import { complicatedWires } from './complicated-wires'
import { keypad } from './keypad'
import { knob } from './knob'
import { mazes } from './mazes'
import { memory } from './memory'
import { morse } from './morse'
import { passwords } from './passwords'
import { simon } from './simon'
import type { ModuleDef } from './types'
import { ventingGas } from './venting-gas'
import { whosOnFirst } from './whos-on-first'
import { wireSequences } from './wire-sequences'
import { wires } from './wires'

/** All modules, in manual order. Drives the page, sidebar and palette. */
export const MODULES: readonly ModuleDef[] = [
  wires,
  button,
  keypad,
  simon,
  whosOnFirst,
  memory,
  morse,
  complicatedWires,
  wireSequences,
  mazes,
  passwords,
  ventingGas,
  capacitor,
  knob,
]
