# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Apprentize is a single-page marketing/product site (no-auth) where visitors sign up for daily UK apprenticeship vacancy alerts and can browse live vacancy listings. It's a Vite + React 18 + TypeScript + Tailwind frontend only — there is no backend code in this repo. Originally scaffolded from a bolt.new template (`.bolt/config.json`, `.bolt/prompt`).

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run typecheck` — `tsc --noEmit -p tsconfig.app.json`

There is no test suite/framework configured in this repo.

## Architecture

**Routing**: No router library. `App.tsx` implements hash-based routing itself via a `useHashRoute` hook that reads `window.location.hash`. The only two routes are the landing page (default) and `#/subscribers` (the live-listings browse page, `SubscribersPage.tsx`), which accepts `postcode` and `radius` query params in the hash (e.g. `#/subscribers?postcode=SW1A%201AA&radius=15`).

**Backend integration**: There is no backend in this repo. Two hooks call a separate external API over `fetch`, configured entirely through Vite env vars declared in `src/vite-env.d.ts`:
- `VITE_AZURE_SUBSCRIBE_URL` — used by `useSubscribe` (`src/hooks/useSubscribe.ts`) to POST signups. If unset, subscribing always errors — there is no local fallback.
- `VITE_API_BASE_URL` — the API's domain only (no path), used by `useApprenticeships` (`src/hooks/useApprenticeships.ts`) to GET `${VITE_API_BASE_URL}/api/apprenticeships/search` for listings. If unset, it falls back to local fixture data in `src/hooks/sampleApprenticeships.ts`, which replicates the real endpoint's filtering/sorting/pagination behavior client-side. This makes the browse page fully usable in local dev without the real API. The domain is environment-driven via Vite's mode-based env files: `.env` (gitignored, local dev) points at `https://localhost:7245` — the Apprentize.Api "https" launch profile — and the committed `.env.production` points at the deployed `https://apprentize-api.azurewebsites.net`.

The real backend is a separate .NET project ("Apprentize.Api", not in this repo) exposing `/api/apprenticeships/search` (public, unauthenticated postcode/radius/title search — see `SearchApprenticeshipsEndpoints.cs`). It's distinct from `/api/available-apprenticeships` (`AvailableApprenticeshipsEndpoints.cs`), which is session/preferences-based and used for signed-up subscribers' email alerts, not this browse page.

**Database schema reference only**: `supabase/migrations/` documents the `subscribers` table schema (email, source, age_group, postcode, radius_miles) that the Azure API backend writes to. There is no `@supabase/supabase-js` client or other Supabase usage anywhere in `src/` — the frontend never talks to Supabase directly, it only goes through the Azure API. Treat these migration files as schema documentation for what the subscribe payload (`SubscribePayload` in `useSubscribe.ts`) ultimately persists to, not as something this repo executes.

**State/data fetching pattern**: Both API-backed hooks follow the same shape — a `state: 'idle' | 'loading' | 'success' | 'error'` union, a typed result, an error message string, and an exposed retry/subscribe callback. Follow this pattern for new data-fetching hooks rather than introducing a data-fetching library.

**Styling**: Tailwind only, with a custom theme in `tailwind.config.js` — brand colors (`ink`, `paper`, `safety`, `teal`, plus `-soft`/`-deep` variants) and custom fonts (`display` = Bricolage Grotesque, `sans` = Inter, `mono` = JetBrains Mono) and animation keyframes (`fade-up`, `slide-in`, `pulse-ring`, `float`, `shimmer`) used throughout components. Reuse these tokens rather than introducing arbitrary colors/fonts.

**Icons**: `lucide-react` only, per `.bolt/prompt` — do not add another icon or UI component library unless the user explicitly asks for it.

## TypeScript config

`tsconfig.app.json` runs in strict mode with `noUnusedLocals` and `noUnusedParameters` enabled — unused variables/params fail `typecheck`, not just lint.
