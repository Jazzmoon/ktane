import { MEMORY_RULES, type Digit, type Stage } from './data'

export type Labels = readonly [Digit, Digit, Digit, Digit]
export interface Press {
  position: Digit
  label: Digit
}

export function solveMemoryStage(stage: Stage, display: Digit, labels: Labels, history: readonly Press[]): Press {
  const rule = MEMORY_RULES[stage - 1]![display - 1]!
  const atPosition = (position: Digit): Press => ({ position, label: labels[position - 1]! })
  const withLabel = (label: Digit): Press => {
    const i = labels.indexOf(label)
    if (i < 0) throw new Error(`No button labelled ${label}`)
    return { position: (i + 1) as Digit, label }
  }
  const earlier = (s: Stage) => {
    const p = history[s - 1]
    if (!p) throw new Error(`Stage ${s} has not been recorded`)
    return p
  }
  switch (rule.kind) {
    case 'pos':
      return atPosition(rule.n)
    case 'label':
      return withLabel(rule.n)
    case 'samePos':
      return atPosition(earlier(rule.stage).position)
    case 'sameLabel':
      return withLabel(earlier(rule.stage).label)
  }
}

/** True if four labels are a permutation of 1–4. */
export function validLabels(labels: readonly number[]): labels is Labels {
  return labels.length === 4 && [1, 2, 3, 4].every((d) => labels.includes(d))
}
