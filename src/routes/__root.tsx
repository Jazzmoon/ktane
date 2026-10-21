/// <reference types="vite/client" />
import { useEffect, type ReactNode } from 'react'
import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { applyTheme, THEME_BOOT_SCRIPT, themeStore } from '@/state/theme'
import appCss from '@/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Better Bomb Manual' },
      {
        name: 'description',
        content: 'Interactive, mobile-friendly manual for Keep Talking and Nobody Explodes with adjustable assistance.',
      },
      { name: 'theme-color', content: '#f8f8f6', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#16171b', media: '(prefers-color-scheme: dark)' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.svg`, type: 'image/svg+xml' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    applyTheme(themeStore.state)
    const sub = themeStore.subscribe(applyTheme)
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onSystem = () => applyTheme(themeStore.state)
    mq.addEventListener('change', onSystem)
    return () => {
      sub.unsubscribe()
      mq.removeEventListener('change', onSystem)
    }
  }, [])

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The boot script may add `dark` before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
