import { useState, useCallback, useEffect } from 'react';
import { sampleApprenticeships } from './sampleApprenticeships';

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
  url?: string;
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
  enabled?: boolean;
}

export function useApprenticeships({
  postcode, radiusMiles, title, page, pageSize,
  sortBy = 'distance', sortOrder = 'asc', enabled = true,
}: UseApprenticeshipsParams) {
  const [state, setState] = useState<SearchState>('idle');
  const [result, setResult] = useState<ApprenticeshipsResult | null>(null);
  const [error, setError] = useState<string>('');

  const search = useCallback(async () => {
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
    const params = new URLSearchParams({
      postcode: postcode.trim(),
      radius: String(radiusMiles),
      page: String(page),
      pageSize: String(pageSize),
      sortBy,
      sortOrder,
    });
    if (title.trim()) params.set('title', title.trim());

    try {
      const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) {
        setState('error');
        setError('Could not load apprenticeships. Please try again.');
        return;
      }
      const data = (await res.json()) as ApprenticeshipsResult;
      setResult(data);
      setState('success');
    } catch {
      setState('error');
      setError('Could not load apprenticeships. Please try again.');
    }
  }, [postcode, radiusMiles, title, page, pageSize, sortBy, sortOrder, enabled]);

  useEffect(() => {
    search();
  }, [search]);

  return { state, result, error, retry: search };
}
