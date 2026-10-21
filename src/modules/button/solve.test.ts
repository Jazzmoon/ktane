import { describe, expect, it } from 'vitest'
import { emptyBomb, solveWith, type BombInfo } from '@/lib/bomb'
import { releaseDigit, solveButton, type ButtonColor, type ButtonLabel } from './solve'

const act = (color: ButtonColor, label: ButtonLabel, bomb: BombInfo = emptyBomb) =>
  solveWith(bomb, (f) => solveButton(color, label, f).action)

describe('the button', () => {
  it('blue + Abort → hold, with no edgework needed', () => {
    expect(act('blue', 'abort')).toEqual({ kind: 'answer', value: 'hold' })
  })
  it('more than one battery + Detonate → tap', () => {
    expect(act('red', 'detonate', { ...emptyBomb, batteries: 2 })).toEqual({
      kind: 'answer',
      value: 'tap',
    })
  })
  it('Detonate with one battery falls through', () => {
    expect(act('red', 'detonate', { ...emptyBomb, batteries: 1, litFRK: false })).toEqual({
      kind: 'answer',
      value: 'hold',
    })
  })
  it('white + lit CAR → hold', () => {
    expect(act('white', 'press', { ...emptyBomb, litCAR: true })).toEqual({
      kind: 'answer',
      value: 'hold',
    })
  })
  it('asks for CAR only for white buttons', () => {
    expect(act('white', 'press')).toEqual({ kind: 'need', fact: 'litCAR' })
  })
  it('more than two batteries + lit FRK → tap', () => {
    expect(act('white', 'press', { ...emptyBomb, litCAR: false, batteries: 3, litFRK: true })).toEqual({
      kind: 'answer',
      value: 'tap',
    })
  })
  it('does not ask about FRK with two or fewer batteries', () => {
    expect(act('red', 'press', { ...emptyBomb, batteries: 2 })).toEqual({
      kind: 'answer',
      value: 'hold',
    })
  })
  it('yellow → hold', () => {
    expect(act('yellow', 'press', { ...emptyBomb, batteries: 0 })).toEqual({
      kind: 'answer',
      value: 'hold',
    })
  })
  it('red + Hold → tap', () => {
    expect(act('red', 'hold', { ...emptyBomb, batteries: 0 })).toEqual({
      kind: 'answer',
      value: 'tap',
    })
  })
  it('otherwise → hold', () => {
    expect(act('blue', 'press', { ...emptyBomb, batteries: 0 })).toEqual({
      kind: 'answer',
      value: 'hold',
    })
  })
})

describe('release digit', () => {
  it('maps strip colours to the digit on the timer', () => {
    expect(releaseDigit('blue')).toBe(4)
    expect(releaseDigit('white')).toBe(1)
    expect(releaseDigit('yellow')).toBe(5)
    expect(releaseDigit('red')).toBe(1)
  })
})
