// Flattens the prerendered client build into a self-contained `dist/` folder
// that any static file server can host (no Node runtime required).
import { cp, rm, stat } from 'node:fs/promises'

const client = 'dist/client'
await stat(`${client}/index.html`).catch(() => {
  throw new Error(`${client}/index.html missing: prerender did not run`)
})
await cp(client, 'dist', { recursive: true })
await rm(client, { recursive: true })
await rm('dist/server', { recursive: true, force: true })
console.log('Static site ready in dist/')
