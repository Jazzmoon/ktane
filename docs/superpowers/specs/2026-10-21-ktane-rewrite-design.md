# Better Bomb Manual — React rewrite design

Date: 2026-10-21
Status: approved in conversation; implementation started.

## Goal

Replace the legacy `www/` site (PHP includes + jQuery + Bootstrap 4 + MDL) with a
modern, fast, mobile-friendly single-page manual for *Keep Talking and Nobody
Explodes* (vanilla manual v1, verification code 241). Every module offers
layered assistance that can be turned down per module and globally.

## Non-goals

- Modded modules.
- Multiplayer / shared state between devices.
- Any backend data or API. All manual data is bundled.

## Stack

| Concern | Choice |
|---|---|
| Framework / SSR | TanStack Start (Vite plugin), TanStack Router file routes |
| React | React 19 + React Compiler (`babel-plugin-react-compiler`) |
| State | TanStack Store + small storage persistence helper |
| UI | Tailwind v4 + shadcn/ui (Command palette, Sheet, ToggleGroup, …) |
| Tests | Vitest + Testing Library |
| Package manager | npm |

No React Query / axios: nothing is fetched at runtime.

## Build targets

1. **Server (primary, self-hosted runner):** `npm run build` → Nitro node
   server in `.output/`, started with `npm start`. The `/` route is
   prerendered at build time and served as static HTML; the server is a thin
   host.
2. **Static (emergency):** `npm run build:static` → plain `dist/` folder
   (prerendered `index.html` + assets) hostable on any static file server.
   Configurable base path via `BASE_PATH`.

## Architecture

```
src/
  routes/__root.tsx, index.tsx     shell + the one page
  state/
    bomb.ts        bomb info store (sessionStorage)
    assist.ts      global ceiling + per-module levels (localStorage)
    session.ts     per-module working state (sessionStorage)
    persist.ts     store <-> storage sync, applied after hydration
  modules/
    registry.ts    ModuleDef list: drives nav, palette, settings
    <module>/
      def.ts       id, title, supported levels, keywords
      data.ts      typed manual data
      solve.ts     pure solver(s) + solve.test.ts
      views        None / Simplified / Interactive components
  components/      ModuleCard, LevelPicker, BombInfoBar, CommandPalette, ui/
```

Solvers are pure functions of `(bombInfo, moduleInput)` and never read React
state, so they are unit-testable without rendering.

## Assistance system

- Levels: `none < simplified < interactive`.
- Every module supports `none`; each declares its higher levels.
- `effectiveLevel = highest supported level ≤ min(moduleSetting, globalCeiling)`.
- Global ceiling acts as a cap: setting it to `none` disables all help without
  forgetting per-module choices.
- Card header shows the module's own picker; options above the ceiling are
  dimmed with a "capped by global" hint.
- Command palette can set global or current-module levels.

## Bomb info

| Field | Input | Derived |
|---|---|---|
| Serial | 6-char text | `lastDigitOdd`, `hasVowel` |
| Batteries | stepper | count |
| Lit indicators | chips CAR, FRK | — |
| Parallel port | toggle | — |
| Strikes | 0 / 1 / 2 | — |

Every field starts **unknown**. Unknown is never treated as false/0: solvers
return a `need` result naming the missing facts, and Simplified views leave
those rules unresolved.

## Persistence

- localStorage: global ceiling, per-module levels, theme.
- sessionStorage: bomb info, per-module working state.
- Prerender always uses defaults; stored values apply after hydration to avoid
  hydration mismatches.
- **New Bomb** clears session state. Each card has its own reset.

## Module catalogue

| Module | None | Simplified | Interactive |
|---|---|---|---|
| Simple Wires | Rules by wire count | Serial-dependent rules resolved | Colours → wire to cut |
| The Button | Rules + strip table | Rules resolved by batteries/CAR/FRK | Colour + label → tap/hold; strip → release digit |
| Keypad | 6 glyph columns | — | Pick 4 glyphs → press order |
| Simon Says | Both tables | Vowel table only, strike column highlighted | Flashes → presses |
| Who's on First | Step 1 + step 2 tables | Searchable lookups | Display → button to read; label → list |
| Memory | Stage rules | Rules + manual history table | Display + labels per stage → answer, history tracked |
| Morse Code | Alphabet + words table | Letter filter → candidates | Dot/dash input → decode → frequency |
| Complicated Wires | Venn diagram + key | Letter table with S/P/B resolved | Wire properties → cut / don't |
| Wire Sequences | Occurrence table | Tap-to-strike table | Colour + letter → cut / don't, counts kept |
| Mazes | 9 SVG mazes | Marker coordinate → matching maze | Marker + start + goal → path (BFS) |
| Passwords | Word list | Column-1 letter filter | Up to 5 columns → candidates |
| Needy Knob | LED tables | — | 12 LEDs → direction |
| Venting Gas | One-line rule | — | — |
| Capacitor Discharge | One-line rule | — | — |

Keypad glyphs: one SVG per glyph (27), traced from the legacy keypad image with
potrace, normalised, `fill="currentColor"`. No Unicode approximations.

## UI shell

- Desktop (≥1024px): sticky left sidebar (module list with level badges,
  scroll-spy, global ceiling, New Bomb), sticky bomb-info bar on top, cards in
  manual order.
- Mobile: sidebar → Sheet; bomb info → bottom bar with one-line summary that
  expands into a sheet. ≥44px touch targets; tap grids instead of dropdowns.
- Command palette (`/`, Ctrl/⌘K, floating button on mobile): jump to module
  (fuzzy, keywords), New Bomb, set global/module level, toggle theme. Jump
  scrolls, focuses first input, flashes card.
- Light/dark themes following system with manual toggle.

## Testing

- Solvers: table-driven Vitest tests per manual rule, including `need` paths.
  Written test-first.
- Data integrity tests for transcribed manual data.
- Assistance logic + persistence unit tests.
- Component smoke tests per module per supported level.
- Build check: prerendered HTML contains every module title.

## Repo layout & migration

New app at repo root. Legacy `www/` kept as reference until parity, then
removed in a final commit after user confirmation.

## CI

GitHub Actions workflow on `runs-on: self-hosted`: install, lint, typecheck,
test, build both targets, upload `.output/` and `dist/` as artifacts.
