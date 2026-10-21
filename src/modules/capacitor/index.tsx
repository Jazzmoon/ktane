import type { ModuleDef } from '../types'

function None() {
  return (
    <p className="text-sm">
      Hold the lever down to discharge the capacitor before it overloads. Release once it's drained; don't let it fill
      up.
    </p>
  )
}

export const capacitor: ModuleDef = {
  id: 'capacitor',
  title: 'Capacitor Discharge',
  summary: 'Needy: hold the lever to discharge',
  keywords: ['needy', 'capacitor', 'lever', 'discharge'],
  needy: true,
  views: { none: None },
}
