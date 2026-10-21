import { useEffect, useState } from 'react'
import { Menu, Search } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { BombBarDesktop, BombBarMobile } from '@/components/bomb-info'
import { CommandPalette } from '@/components/command-palette'
import { ModuleCard } from '@/components/module-card'
import { Sidebar, ThemeButton } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { MODULES } from '@/modules/registry'
import { activeModuleStore } from '@/state/active'
import { restorePersisted } from '@/state/persist'

export const Route = createFileRoute('/')({ component: Manual })

/** Active module = the last card whose top has crossed 30% of the viewport. */
function useScrollSpy() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      let active: string | null = null
      for (const el of document.querySelectorAll<HTMLElement>('[data-module]')) {
        if (el.getBoundingClientRect().top <= line) active = el.id
        else break
      }
      activeModuleStore.setState(() => active)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

function Manual() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  useScrollSpy()

  // Stored settings apply only once this route has hydrated, so the
  // prerendered HTML (always defaults) matches the first client render. This
  // must live inside the route: the root's effects can run before the route's
  // Suspense boundary finishes hydrating.
  useEffect(() => restorePersisted(), [])

  const openPalette = () => {
    setNavOpen(false)
    setPaletteOpen(true)
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh border-r bg-card/40 lg:block">
        <Sidebar onSearch={openPalette} />
      </aside>

      <div>
        <header className="sticky top-0 z-20 flex items-center gap-1 border-b bg-background/90 px-2 py-2 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Open module list"
            onClick={() => setNavOpen(true)}
          >
            <Menu />
          </Button>
          <span className="flex-1 truncate font-semibold tracking-tight">Better Bomb Manual</span>
          <Button variant="ghost" size="icon" className="size-11" aria-label="Jump to module" onClick={openPalette}>
            <Search />
          </Button>
          <ThemeButton />
        </header>

        <BombBarDesktop />

        <main className="mx-auto max-w-4xl space-y-4 px-3 pt-4 pb-28 sm:px-6 lg:pb-12">
          <div className="px-1 pb-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Better Bomb Manual</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Interactive Keep Talking and Nobody Explodes manual · version 1 · verification code 241. Set assistance
              per module or cap it for everything in the sidebar.
            </p>
          </div>
          {MODULES.map((m) => (
            <ModuleCard key={m.id} def={m} />
          ))}
          <footer className="px-1 pt-4 text-xs text-muted-foreground">
            Unofficial fan-made manual by Team Jazzmoon, for private play. Not affiliated with Steel Crate Games.
          </footer>
        </main>
      </div>

      <BombBarMobile />

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-xs p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Modules</SheetTitle>
          <SheetDescription className="sr-only">Module list and assistance settings</SheetDescription>
          <Sidebar onNavigate={() => setNavOpen(false)} onSearch={openPalette} />
        </SheetContent>
      </Sheet>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  )
}
