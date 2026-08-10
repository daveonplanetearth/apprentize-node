import { useState } from 'react';

const STORAGE_KEY = 'apz_viewed_apprenticeships';
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

type ViewedMap = Record<string, number>;

function readViewed(): ViewedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ViewedMap;
    const cutoff = Date.now() - TTL_MS;
    const pruned: ViewedMap = {};
    for (const [id, viewedAt] of Object.entries(parsed)) {
      if (viewedAt >= cutoff) pruned[id] = viewedAt;
    }
    return pruned;
  } catch {
    return {};
  }
}

// Records that an apprenticeship's details were successfully loaded, so the browse page can
// later show a "Viewed" label — best-effort only (silently no-ops if localStorage is unavailable,
// e.g. private browsing quota).
export function markApprenticeshipViewed(id: string): void {
  try {
    const map = readViewed();
    map[id] = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

// Snapshot of viewed IDs (entries older than TTL_MS already pruned) for the browse page to
// check against — read once on mount, since ApprenticeshipsPage fully remounts on route
// changes (see App.tsx), so a fresh read on return from the details page is enough.
export function useViewedApprenticeships(): Set<string> {
  const [viewed] = useState<Set<string>>(() => new Set(Object.keys(readViewed())));
  return viewed;
}
