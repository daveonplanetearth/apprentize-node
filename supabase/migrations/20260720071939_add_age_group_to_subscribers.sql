/*
# Add age_group column to subscribers

## Purpose
The signup form now asks the visitor's age group so Apprentize can tailor which
apprenticeship levels are relevant (e.g. under-16s are pre-16, 16-17 is the
typical intermediate window, 18+ covers advanced/higher).

## Changes
- `subscribers.age_group` (text, nullable) — one of 'under_16', '16_17', '18_plus'.
  Nullable so existing rows and any edge-case inserts still succeed.

## Security
- No policy changes. The existing anon INSERT policy already permits inserts;
  the new column is covered by it automatically.
*/

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS age_group text;
