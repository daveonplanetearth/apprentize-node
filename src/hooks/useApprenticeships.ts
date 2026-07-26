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
  url?: string;
}

export interface ApprenticeshipsResult {
  items: Apprenticeship[];
  page: number;
  pageSize: number;
  total: number;
}

export type SearchState = 'idle' | 'loading' | 'success' | 'error';

const ENDPOINT = import.meta.env.VITE_AZURE_APPRENTICESHIPS_URL as string | undefined;

export interface UseApprenticeshipsParams {
  postcode: string;
  radiusMiles: number;
  title: string;
  page: number;
  pageSize: number;
  enabled?: boolean;
}

export function useApprenticeships({ postcode, radiusMiles, title, page, pageSize, enabled = true }: UseApprenticeshipsParams) {
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
      const data = sampleApprenticeships({ postcode: postcode.trim(), radiusMiles, title, page, pageSize });
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
  }, [postcode, radiusMiles, title, page, pageSize, enabled]);

  useEffect(() => {
    search();
  }, [search]);

  return { state, result, error, retry: search };
}
