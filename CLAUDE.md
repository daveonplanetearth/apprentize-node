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

**Routing**: No router library. `App.tsx` implements hash-based routing itself via a `useHashRoute` hook that reads `window.location.hash`. Routes are the landing page (default), `#/apprenticeships` (the live-listings browse page, `ApprenticeshipsPage.tsx`), which accepts `postcode` and `radius` query params (e.g. `#/apprenticeships?postcode=SW1A%201AA&radius=15`), and `#/preferences` (`PreferencesPage.tsx`), which accepts a `token` query param carrying the one-time manage token from an emailed link (e.g. `#/preferences?token=...`).

**Backend integration**: There is no backend in this repo. All hooks call a separate external API over `fetch`, configured through a single Vite env var declared in `src/vite-env.d.ts`:
- `VITE_API_BASE_URL` — the API's domain only (no path). Used by `useSubscribe` (`src/hooks/useSubscribe.ts`) to POST signups to `${VITE_API_BASE_URL}/api/signup`, by `useApprenticeships` (`src/hooks/useApprenticeships.ts`) to GET `${VITE_API_BASE_URL}/api/apprenticeships/search` for listings, and by `usePreferences` (`src/hooks/usePreferences.ts`) to GET/POST `${VITE_API_BASE_URL}/api/preferences` plus the account-management endpoints below. If unset, signups and preferences always error (no local fallback), while listings fall back to local fixture data in `src/hooks/sampleApprenticeships.ts`, which replicates the real endpoint's filtering/sorting/pagination behavior client-side — this makes the browse page fully usable in local dev without the real API. The domain is environment-driven via Vite's mode-based env files: `.env` (gitignored, local dev) points at `https://localhost:7245` — the Apprentize.Api "https" launch profile — and the committed `.env.production` points at the deployed `https://apprentize-api.azurewebsites.net`.

The real backend is a separate .NET project ("Apprentize.Api", not in this repo). `/api/signup` (`SignUpEndpoints.cs`) is public/unauthenticated and always returns a neutral 200 (it never reveals whether an email is already registered); it only accepts `ageBand` values `"16to17"`/`"18plus"` and `searchRadiusMiles` values `5`/`10`/`15`/`25` — anything else silently no-ops server-side, so the frontend's age/radius options must stay in lockstep with those constraints. `/api/apprenticeships/search` (public, unauthenticated postcode/radius/title search — see `SearchApprenticeshipsEndpoints.cs`) is distinct from `/api/available-apprenticeships` (`AvailableApprenticeshipsEndpoints.cs`), which is session/preferences-based and used for signed-up subscribers' email alerts, not this browse page.

**Preferences/account auth**: `/api/preferences` (GET/POST), `/api/unsubscribe`, `/api/delete`, `/api/logout`, and `/api/logout-all` (all `Apprentize.Api/Endpoints/*.cs`) authenticate via `ManageTokenValidator`, which accepts either an `Authorization: Bearer <sessionToken>` header or a one-time `?token=<manageToken>` query param (the link emailed to subscribers). A manage token, once resolved, is exchanged server-side for a session token returned as `sessionToken` in the response body — `usePreferences` stores this in `localStorage` under `apz_session_token` (same key the .NET web app's `api-client.js` uses) and sends it as the bearer header on every subsequent call, so the URL token only needs to work once. Any 401 means the token is missing, invalid, or expired; `PreferencesPage.tsx` responds by clearing the hash and redirecting to the landing page rather than showing an inline error, per product decision — this differs from the .NET Razor Pages version's `Preferences.cshtml`/`preferences.js`, which shows a "link not recognised" panel instead.

`ApprenticeshipsPage.tsx` also does a lightweight, best-effort version of this: if no `postcode` was passed via the URL and a session token is already in `localStorage`, it calls `fetchStoredPreferences()` (`usePreferences.ts`, bearer-only, no manage-token exchange, no redirect) to silently pre-fill postcode/radius and auto-search — same idea as the .NET `AvailableApprenticeships.cshtml`/`available-apprenticeships.js`'s session-aware pre-fill, but layered on top of this page's own public `/api/apprenticeships/search` flow rather than switching to the session-only `/api/available-apprenticeships` endpoint (different result shape, no title search, not used by this page). An explicit URL postcode always takes priority over stored preferences, and any failure (no API configured, invalid/expired token) falls back to the page's normal anonymous default (`SW1A 1AA`) — the stale-token case also clears `apz_session_token` via `apiFetch`'s existing 401 handling.

**Database schema reference only**: `supabase/migrations/` documents the `subscribers` table schema (email, source, age_group, postcode, radius_miles) that the Azure API backend writes to. There is no `@supabase/supabase-js` client or other Supabase usage anywhere in `src/` — the frontend never talks to Supabase directly, it only goes through the Azure API. Treat these migration files as schema documentation for what the subscribe payload (`SubscribePayload` in `useSubscribe.ts`) ultimately persists to, not as something this repo executes.

**State/data fetching pattern**: Both API-backed hooks follow the same shape — a `state: 'idle' | 'loading' | 'success' | 'error'` union, a typed result, an error message string, and an exposed retry/subscribe callback. Follow this pattern for new data-fetching hooks rather than introducing a data-fetching library.

**Styling**: Tailwind only, with a custom theme in `tailwind.config.js` — brand colors (`ink`, `paper`, `safety`, `teal`, plus `-soft`/`-deep` variants) and custom fonts (`display` = Bricolage Grotesque, `sans` = Inter, `mono` = JetBrains Mono) and animation keyframes (`fade-up`, `slide-in`, `pulse-ring`, `float`, `shimmer`) used throughout components. Reuse these tokens rather than introducing arbitrary colors/fonts.

**Icons**: `lucide-react` only, per `.bolt/prompt` — do not add another icon or UI component library unless the user explicitly asks for it.

## TypeScript config

`tsconfig.app.json` runs in strict mode with `noUnusedLocals` and `noUnusedParameters` enabled — unused variables/params fail `typecheck`, not just lint.
