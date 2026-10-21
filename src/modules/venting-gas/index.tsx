import type { ModuleDef } from '../types'

function None() {
  return (
    <ul className="space-y-1.5 text-sm">
      <li>
        Answer the computer's prompt with <strong>Y</strong> or <strong>N</strong> before the timer runs out.
      </li>
      <li>
        <span className="font-mono">VENT GAS?</span> → <strong>Y</strong>
      </li>
      <li>
        <span className="font-mono">DETONATE?</span> → <strong>N</strong>
      </li>
    </ul>
  )
}

export const ventingGas: ModuleDef = {
  id: 'venting-gas',
  title: 'Venting Gas',
  summary: 'Needy: answer Y/N prompts',
  keywords: ['needy', 'vent', 'gas', 'computer', 'yes', 'no'],
  needy: true,
  views: { none: None },
}
