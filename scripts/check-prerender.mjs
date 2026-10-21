// Fails if a build's index.html wasn't actually prerendered: every module
// heading must be present in the static HTML, not just rendered client-side.
//   node scripts/check-prerender.mjs <path/to/index.html>
import { readFile } from 'node:fs/promises'

const file = process.argv[2]
const html = await readFile(file, 'utf8')
const titles = [
  'Simple Wires',
  'The Button',
  'Keypad',
  'Simon Says',
  'Who&#x27;s on First',
  'Memory',
  'Morse Code',
  'Complicated Wires',
  'Wire Sequences',
  'Mazes',
  'Passwords',
  'Venting Gas',
  'Capacitor Discharge',
  'Knobs',
]
const missing = titles.filter((t) => !html.includes(`>${t}`))
if (missing.length) {
  console.error(`${file}: not prerendered, missing ${missing.join(', ')}`)
  process.exit(1)
}
console.log(`${file}: all ${titles.length} modules prerendered`)
