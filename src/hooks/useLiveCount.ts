import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

/**
 * The number of apprenticeship places (positions, not vacancies) across the apprenticeships
 * Apprentize can show right now, as totalled at the last vacancy sync (GET /api/stats). Null while loading, and stays null if there's no count fit to show — the API
 * withholds one that's gone stale — or it can't be fetched. Never a made-up fallback.
 */
export function useLiveCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!API_BASE_URL) return;
    let cancelled = false;

    fetch(`${API_BASE_URL}/api/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.liveApprenticeships === 'number') setCount(data.liveApprenticeships);
      })
      .catch(() => {
        // Leave it hidden.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}

/**
 * How the landing page shows a live count, or null to hide it. From 10 up, rounded down to the
 * nearest 10 with a "+" — the count is taken at each sync and vacancies close in between, so a
 * rounded-down figure stays true for longer than an exact one. Below 10 the exact number (rounding
 * would read "0+"), and nothing at all for zero.
 */
export function liveCountLabel(count: number): { figure: string; noun: string } | null {
  if (!Number.isInteger(count) || count <= 0) return null;
  if (count < 10) return { figure: String(count), noun: count === 1 ? 'place' : 'places' };
  return { figure: `${(Math.floor(count / 10) * 10).toLocaleString('en-GB')}+`, noun: 'places' };
}
