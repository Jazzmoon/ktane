import { Store } from '@tanstack/react-store'
import { persist } from './persist'

export type ThemePref = 'system' | 'light' | 'dark'

export const themeStore = new Store<ThemePref>('system')

persist(themeStore, {
  key: 'theme',
  storage: 'local',
  parse: (raw) => (raw === 'light' || raw === 'dark' || raw === 'system' ? raw : null),
})

export function applyTheme(pref: ThemePref) {
  const dark = pref === 'dark' || (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function cycleTheme() {
  themeStore.setState((t) => (t === 'system' ? 'light' : t === 'light' ? 'dark' : 'system'))
}

/**
 * Inline script for <head>: applies the stored theme before first paint so
 * dark-mode users never see a light flash. Must mirror `applyTheme`.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem('bbm:v1:theme')||'"system"');var d=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`
