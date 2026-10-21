# Better Bomb Manual

Keep Talking and Nobody Explodes has a very complex manual, and an easier one to read
can make all the difference while defusing. This is an interactive, mobile-friendly
manual (vanilla manual **version 1**, verification code **241**). It is not official,
and is meant only for private play sessions.

Every module has an adjustable level of help:

| Level | What you get |
|---|---|
| **Off** | The plain manual: rules and tables, no help |
| **Simple** | Condensed rules that react to the bomb info you've entered |
| **Solver** | Enter what you see on the module and get the answer |

Each module has its own setting. The sidebar's **Max assistance** setting caps all of
them at once without forgetting each module's own choice. Bomb info starts *unknown*,
and nothing is ever assumed: a solver asks for the edgework it needs.

Press `/` or `Ctrl/⌘ K` to jump to a module.

## Stack

React 19 + React Compiler · TanStack Start / Router / Store · Tailwind CSS v4 + shadcn/ui ·
Vitest. The page is prerendered to static HTML at build time and hydrated in the browser.

## Development

```sh
npm ci
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + tests
```

## Building and hosting

**Primary: Node server** (self-hosted runner)

```sh
npm run build      # → .output/
npm start          # node .output/server/index.mjs  (PORT=3000 by default)
```

**Emergency: static files.** No Node runtime is needed to serve this build.

```sh
npm run build:static          # → dist/  (index.html + assets)
npm run serve:static          # optional zero-dependency local server
BASE_PATH=/ktane/ npm run build:static   # when hosted under a sub-path
```

Copy `dist/` to any static host: nginx, Caddy, S3, GitHub Pages and so on.

Both builds fail if the page didn't prerender (`scripts/check-prerender.mjs`).

## Project layout

```
src/
  lib/          bomb facts + assistance-level logic (pure, tested)
  state/        TanStack stores, persisted to local/session storage after hydration
  modules/      one folder per module: data.ts, solve.ts (+ tests), index.tsx (views)
  components/   app shell, bomb info, command palette, shared UI kit, shadcn ui/
  routes/       TanStack Router file routes (single page)
```

Assistance settings and theme persist in `localStorage`. Bomb info and module inputs live
in `sessionStorage` and are cleared by **New bomb**.
