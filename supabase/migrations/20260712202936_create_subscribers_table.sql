/*
# Create subscribers table for Apprentize email alerts

## Purpose
Apprentize is a no-auth landing page where visitors enter their email address
to register for daily apprenticeship vacancy alerts. There is no sign-in flow —
the only write path is an anonymous visitor submitting their email.

## New Tables
- `subscribers`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `email` (text, unique, not null) — the visitor's email address
  - `created_at` (timestamptz, default now())
  - `source` (text, nullable) — optional signup source label (e.g. "hero", "footer")

## Security
- Row Level Security enabled on `subscribers`.
- INSERT is open to anon + authenticated so the public landing page can add a
  subscriber without signing in. This is intentionally public write access for
  the single purpose of subscribing.
- SELECT / UPDATE / DELETE are disabled (no policies) so no client can read,
  list, modify, or remove subscriber emails — only inserts are accepted.
  This protects subscriber privacy while still allowing signups.

## Notes
1. The unique constraint on `email` prevents duplicate subscriptions; the
   frontend treats a duplicate-insert error as "already subscribed" success.
2. No user_id / auth.users wiring — this is a single-tenant no-auth app.
*/

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert (subscribe). No SELECT/UPDATE/DELETE
-- policies are defined, so subscriber emails are never readable from the client.
DROP POLICY IF EXISTS "anon_insert_subscribers" ON subscribers;
CREATE POLICY "anon_insert_subscribers"
ON subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);
