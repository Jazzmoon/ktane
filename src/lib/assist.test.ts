import { describe, expect, it } from 'vitest'
import { effectiveLevel, isCapped } from './assist'

const all = ['none', 'simplified', 'interactive'] as const

describe('effectiveLevel', () => {
  it('uses the module setting when under the ceiling', () => {
    expect(effectiveLevel('simplified', 'interactive', all)).toBe('simplified')
  })

  it('caps the module setting at the global ceiling', () => {
    expect(effectiveLevel('interactive', 'simplified', all)).toBe('simplified')
    expect(effectiveLevel('interactive', 'none', all)).toBe('none')
  })

  it('snaps down to the nearest supported level', () => {
    expect(effectiveLevel('simplified', 'interactive', ['none', 'interactive'])).toBe('none')
    expect(effectiveLevel('interactive', 'interactive', ['none', 'simplified'])).toBe('simplified')
  })

  it('always falls back to none', () => {
    expect(effectiveLevel('interactive', 'interactive', ['none'])).toBe('none')
  })
})

describe('isCapped', () => {
  it('is true only when the ceiling is below the module setting', () => {
    expect(isCapped('interactive', 'simplified')).toBe(true)
    expect(isCapped('simplified', 'simplified')).toBe(false)
    expect(isCapped('none', 'none')).toBe(false)
  })
})
