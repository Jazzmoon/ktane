import { describe, expect, it } from 'vitest'
import { emptyBomb, solveWith } from '@/lib/bomb'
import { solveWires, type Wire } from './solve'

const odd = { ...emptyBomb, serial: 'AB1CD3' }
const even = { ...emptyBomb, serial: 'AB1CD4' }
const cut = (wires: Wire[], bomb = emptyBomb) => solveWith(bomb, (f) => solveWires(wires, f).cut)

describe('simple wires: 3 wires', () => {
  it('no red → cut the second wire', () => {
    expect(cut(['blue', 'blue', 'white'])).toEqual({ kind: 'answer', value: 2 })
  })
  it('last wire white → cut the last wire', () => {
    expect(cut(['red', 'blue', 'white'])).toEqual({ kind: 'answer', value: 3 })
  })
  it('more than one blue → cut the last blue wire', () => {
    expect(cut(['blue', 'blue', 'red'])).toEqual({ kind: 'answer', value: 2 })
    expect(cut(['blue', 'red', 'blue'])).toEqual({ kind: 'answer', value: 3 })
  })
  it('otherwise → cut the last wire', () => {
    expect(cut(['red', 'yellow', 'black'])).toEqual({ kind: 'answer', value: 3 })
  })
})

describe('simple wires: 4 wires', () => {
  it('more than one red and serial odd → cut the last red', () => {
    expect(cut(['red', 'red', 'blue', 'blue'], odd)).toEqual({ kind: 'answer', value: 2 })
  })
  it('asks for the serial only when there is more than one red', () => {
    expect(cut(['red', 'red', 'blue', 'blue'])).toEqual({ kind: 'need', fact: 'serialOdd' })
    expect(cut(['red', 'blue', 'white', 'white'])).toEqual({ kind: 'answer', value: 1 })
  })
  it('more than one red but serial even falls through', () => {
    expect(cut(['red', 'red', 'black', 'black'], even)).toEqual({ kind: 'answer', value: 2 })
  })
  it('last wire yellow and no red → cut the first wire', () => {
    expect(cut(['blue', 'white', 'black', 'yellow'])).toEqual({ kind: 'answer', value: 1 })
  })
  it('exactly one blue → cut the first wire', () => {
    expect(cut(['black', 'blue', 'white', 'white'])).toEqual({ kind: 'answer', value: 1 })
  })
  it('more than one yellow → cut the last wire', () => {
    expect(cut(['yellow', 'yellow', 'black', 'black'])).toEqual({ kind: 'answer', value: 4 })
  })
  it('otherwise → cut the second wire', () => {
    expect(cut(['black', 'white', 'black', 'white'])).toEqual({ kind: 'answer', value: 2 })
  })
})

describe('simple wires: 5 wires', () => {
  it('last wire black and serial odd → cut the fourth wire', () => {
    expect(cut(['red', 'red', 'red', 'red', 'black'], odd)).toEqual({ kind: 'answer', value: 4 })
  })
  it('asks for the serial only when the last wire is black', () => {
    expect(cut(['red', 'red', 'red', 'red', 'black'])).toEqual({ kind: 'need', fact: 'serialOdd' })
  })
  it('exactly one red and more than one yellow → cut the first wire', () => {
    expect(cut(['red', 'yellow', 'yellow', 'black', 'black'], even)).toEqual({
      kind: 'answer',
      value: 1,
    })
  })
  it('no black → cut the second wire', () => {
    expect(cut(['red', 'red', 'blue', 'blue', 'white'])).toEqual({ kind: 'answer', value: 2 })
  })
  it('otherwise → cut the first wire', () => {
    expect(cut(['black', 'red', 'red', 'blue', 'white'])).toEqual({ kind: 'answer', value: 1 })
  })
})

describe('simple wires: 6 wires', () => {
  it('no yellow and serial odd → cut the third wire', () => {
    expect(cut(['red', 'red', 'red', 'red', 'red', 'red'], odd)).toEqual({
      kind: 'answer',
      value: 3,
    })
  })
  it('asks for the serial only when there is no yellow', () => {
    expect(cut(['red', 'red', 'red', 'red', 'red', 'red'])).toEqual({
      kind: 'need',
      fact: 'serialOdd',
    })
  })
  it('exactly one yellow and more than one white → cut the fourth wire', () => {
    expect(cut(['yellow', 'white', 'white', 'red', 'red', 'red'])).toEqual({
      kind: 'answer',
      value: 4,
    })
  })
  it('no red → cut the last wire', () => {
    expect(cut(['blue', 'blue', 'blue', 'blue', 'blue', 'blue'], even)).toEqual({
      kind: 'answer',
      value: 6,
    })
  })
  it('otherwise → cut the fourth wire', () => {
    expect(cut(['red', 'blue', 'blue', 'blue', 'blue', 'blue'], even)).toEqual({
      kind: 'answer',
      value: 4,
    })
  })
})

it('rejects impossible wire counts', () => {
  expect(() => cut(['red', 'blue'])).toThrow()
  expect(() => cut(['red', 'red', 'red', 'red', 'red', 'red', 'red'])).toThrow()
})
