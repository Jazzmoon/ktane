import { useSelector } from '@tanstack/react-store'
import { solveWith, type Facts, type Solution } from '@/lib/bomb'
import { bombStore } from '@/state/bomb'

export function useBomb() {
  return useSelector(bombStore)
}

/** Runs a rule against the live bomb info. */
export function useSolution<T>(rule: (f: Facts) => T): Solution<T> {
  return solveWith(useBomb(), rule)
}
