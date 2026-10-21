import { Store } from '@tanstack/react-store'

/** Id of the module currently at the top of the viewport (scroll-spy). */
export const activeModuleStore = new Store<string | null>(null)

/** Scrolls to a module, flashes it and focuses its first control. */
export function jumpToModule(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  history.replaceState(null, '', `#${id}`)
  el.scrollIntoView({ block: 'start' })
  el.classList.remove('flash')
  void el.offsetWidth
  el.classList.add('flash')
  const control = el.querySelector<HTMLElement>(':scope > div:last-child :is(input, button):not([disabled])')
  control?.focus({ preventScroll: true })
}
