/*
# Add postcode + radius to subscribers

## Purpose
Subscribers can now filter alerts by location: a postcode and a search radius.

## Changes
- `subscribers.postcode` (text, nullable) — UK postcode entered by the subscriber.
- `subscribers.radius_miles` (int, nullable, default 15) — search radius in miles.

## Security
- No policy changes. The existing anon INSERT policy covers the new columns.
*/

ALTER TABLE subscribers
  ADD COLUMN IF NOT EXISTS postcode text,
  ADD COLUMN IF NOT EXISTS radius_miles int DEFAULT 15;
