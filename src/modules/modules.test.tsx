import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ModuleCard } from '@/components/module-card'
import { emptyBomb } from '@/lib/bomb'
import { assistStore, setCeiling, setModuleLevel } from '@/state/assist'
import { bombStore, updateBomb } from '@/state/bomb'
import { sessionStore } from '@/state/session'
import { MODULES } from './registry'
import { supportedLevels } from './types'

beforeEach(() => {
  act(() => {
    assistStore.setState(() => ({ ceiling: 'interactive', modules: {} }))
    bombStore.setState(() => emptyBomb)
    sessionStore.setState(() => ({}))
  })
})

const byId = (id: string) => MODULES.find((m) => m.id === id)!

describe('every module renders at every supported level', () => {
  for (const def of MODULES)
    for (const level of supportedLevels(def))
      it(`${def.title} @ ${level}`, () => {
        act(() => setModuleLevel(def.id, level))
        render(<ModuleCard def={def} />)
        expect(screen.getByRole('heading', { name: new RegExp(def.title) })).toBeInTheDocument()
      })
})

it('module ids are unique', () => {
  expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length)
})

describe('global ceiling', () => {
  it('caps a module and says so', () => {
    act(() => setCeiling('none'))
    render(<ModuleCard def={byId('wires')} />)
    expect(screen.getByText(/capped by global assistance/i)).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Add wire' })).not.toBeInTheDocument()
  })
})

describe('simple wires solver UI', () => {
  it('asks for the serial, then answers', async () => {
    const user = userEvent.setup()
    render(<ModuleCard def={byId('wires')} />)
    const pad = screen.getByRole('group', { name: 'Add wire' })
    for (const c of ['Red', 'Red', 'Blue', 'Blue']) await user.click(within(pad).getByRole('button', { name: c }))
    expect(screen.getByText(/serial number \(last digit\)/)).toBeInTheDocument()
    act(() => updateBomb({ serial: 'AB12C3' }))
    expect(screen.getByRole('status')).toHaveTextContent('Cut the second wire')
  })
})

describe('keypad solver UI', () => {
  it('orders four picked glyphs', async () => {
    const user = userEvent.setup()
    render(<ModuleCard def={byId('keypad')} />)
    for (const name of [/^Omega/, /^Six/, /^AE/, /^Tracks/])
      await user.click(screen.getAllByRole('button', { name })[0]!)
    const status = screen.getByRole('status')
    expect(
      within(status)
        .getAllByRole('img')
        .map((i) => i.getAttribute('aria-label')),
    ).toEqual(['Six (б)', 'Tracks (҂)', 'AE (æ)', 'Omega (Ω)'])
  })
})

describe('the button simplified grid', () => {
  it('shows ? until edgework is known', () => {
    act(() => setModuleLevel('button', 'simplified'))
    render(<ModuleCard def={byId('button')} />)
    expect(screen.getAllByText('?').length).toBeGreaterThan(0)
    act(() => updateBomb({ batteries: 1, litCAR: false, litFRK: false }))
    expect(screen.queryAllByText('?')).toHaveLength(0)
  })
})

describe('module reset', () => {
  it('clears working state', async () => {
    const user = userEvent.setup()
    render(<ModuleCard def={byId('simon')} />)
    await user.click(within(screen.getByRole('group', { name: 'Add flash' })).getByRole('button', { name: 'Red' }))
    expect(sessionStore.state.simon).toEqual(['red'])
    await user.click(screen.getByRole('button', { name: 'Reset Simon Says' }))
    expect(sessionStore.state.simon).toBeUndefined()
  })
})
