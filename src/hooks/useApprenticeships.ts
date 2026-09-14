import { useState, useCallback, useEffect } from 'react';
import { sampleApprenticeships } from './sampleApprenticeships';
import { analyticsHeaders } from './analytics';

export interface Apprenticeship {
  id: string;
  title: string;
  company: string;
  level: string;
  wage?: string;
  location: string;
  distanceMiles?: number;
  postedDate: string;
  closingDate?: string;
  // url is the API's pre-resolved link; applicationUrl/vacancyUrl are the raw source URLs it also
  // returns, so a consumer can prefer the employer's own application link (as the details page does).
  url?: string;
  applicationUrl?: string;
  vacancyUrl?: string;
  numberOfPositions?: number;
}

export type SortBy = 'postedDate' | 'closingDate' | 'distance';
export type SortOrder = 'asc' | 'desc';

export interface ApprenticeshipsResult {
  items: Apprenticeship[];
  page: number;
  pageSize: number;
  total: number;
}

export type SearchState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Why a search failed: the postcode doesn't exist (fix the postcode — retrying won't help), the
 * API couldn't check it right now (retry), or anything else.
 */
export type SearchErrorKind = 'invalid_postcode' | 'postcode_lookup_unavailable' | 'other';

const DEFAULT_ERROR = 'Could not load apprenticeships. Please try again.';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/apprenticeships/search` : undefined;

export interface UseApprenticeshipsParams {
  postcode: string;
  radiusMiles: number;
  title: string;
  page: number;
  pageSize: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  /** Only these routes/courses, by the same rule as the alerts. Empty means no filter. */
  routeIds?: number[];
  larsCodes?: number[];
  enabled?: boolean;
}

const NO_IDS: number[] = [];

export function useApprenticeships({
  postcode, radiusMiles, title, page, pageSize,
  sortBy = 'distance', sortOrder = 'asc', routeIds = NO_IDS, larsCodes = NO_IDS, enabled = true,
}: UseApprenticeshipsParams) {
  // Joined so the search callback depends on the ids' values, not on array identity.
  const routes = routeIds.join(',');
  const courses = larsCodes.join(',');
  const [state, setState] = useState<SearchState>('idle');
  const [result, setResult] = useState<ApprenticeshipsResult | null>(null);
  const [error, setError] = useState<string>('');
  const [errorKind, setErrorKind] = useState<SearchErrorKind | null>(null);

  const search = useCallback(async () => {
    const fail = (kind: SearchErrorKind, message: string) => {
      setState('error');
      setErrorKind(kind);
      setError(message);
    };

    if (!enabled) return;
    if (!postcode.trim()) {
      setState('idle');
      setResult(null);
      return;
    }
    if (!ENDPOINT) {
      const data = sampleApprenticeships({ postcode: postcode.trim(), radiusMiles, title, page, pageSize, sortBy, sortOrder });
      setResult(data);
      setState('success');
      return;
    }
    setState('loading');
    setError('');
    setErrorKind(null);
    const params = new URLSearchParams({
      postcode: postcode.trim(),
      radius: String(radiusMiles),
      page: String(page),
      pageSize: String(pageSize),
      sortBy,
      sortOrder,
    });
    if (title.trim()) params.set('title', title.trim());
    if (routes) params.set('routes', routes);
    if (courses) params.set('courses', courses);

    try {
      const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', ...analyticsHeaders() },
      });
      if (!res.ok) {
        // The API words its postcode errors itself, as it does for signup and preferences.
        const body: { error?: string; message?: string } | null = await res.json().catch(() => null);
        if (body?.error === 'invalid_postcode' || body?.error === 'postcode_lookup_unavailable') {
          fail(body.error, body.message ?? DEFAULT_ERROR);
        } else {
          fail('other', DEFAULT_ERROR);
        }
        return;
      }
      const data = (await res.json()) as ApprenticeshipsResult;
      setResult(data);
      setState('success');
    } catch {
      fail('other', DEFAULT_ERROR);
    }
  }, [postcode, radiusMiles, title, page, pageSize, sortBy, sortOrder, routes, courses, enabled]);

  useEffect(() => {
    search();
  }, [search]);

  return { state, result, error, errorKind, retry: search };
}
