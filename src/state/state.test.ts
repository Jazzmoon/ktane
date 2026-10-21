import { beforeEach, describe, expect, it, vi } from 'vitest'

// Fresh module graph per test so stores and the persistence registry reset.
async function load() {
  vi.resetModules()
  const persist = await import('./persist')
  const bomb = await import('./bomb')
  const assist = await import('./assist')
  const session = await import('./session')
  return { ...persist, ...bomb, ...assist, ...session }
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
})

describe('persistence', () => {
  it('does not read storage until restorePersisted runs', async () => {
    localStorage.setItem('bbm:v1:assist', JSON.stringify({ ceiling: 'none', modules: {} }))
    const s = await load()
    expect(s.assistStore.state.ceiling).toBe('interactive')
    s.restorePersisted()
    expect(s.assistStore.state.ceiling).toBe('none')
  })

  it('writes changes back to the right storage', async () => {
    const s = await load()
    s.restorePersisted()
    s.setModuleLevel('wires', 'simplified')
    s.updateBomb({ batteries: 3 })
    expect(JSON.parse(localStorage.getItem('bbm:v1:assist')!).modules.wires).toBe('simplified')
    expect(JSON.parse(sessionStorage.getItem('bbm:v1:bomb')!).batteries).toBe(3)
    expect(localStorage.getItem('bbm:v1:bomb')).toBeNull()
  })

  it('ignores corrupt or invalid stored values', async () => {
    localStorage.setItem('bbm:v1:assist', '{not json')
    sessionStorage.setItem('bbm:v1:bomb', JSON.stringify({ batteries: -2, strikes: 7, litCAR: 'yes' }))
    const s = await load()
    s.restorePersisted()
    expect(s.assistStore.state.ceiling).toBe('interactive')
    expect(s.bombStore.state).toMatchObject({ batteries: null, strikes: null, litCAR: null })
  })
})

describe('newBomb', () => {
  it('clears bomb info and module state but keeps assistance settings', async () => {
    const s = await load()
    s.restorePersisted()
    s.setCeiling('simplified')
    s.updateBomb({ serial: 'AB12C3', batteries: 2 })
    s.sessionStore.setState(() => ({ memory: { stage: 3 } }))
    s.newBomb()
    expect(s.bombStore.state.serial).toBe('')
    expect(s.bombStore.state.batteries).toBeNull()
    expect(s.sessionStore.state).toEqual({})
    expect(s.assistStore.state.ceiling).toBe('simplified')
  })
})
