import { useState, useCallback, useEffect } from 'react';
import { sampleApprenticeshipDetails } from './sampleApprenticeships';
import { markApprenticeshipViewed } from './useViewedApprenticeships';

export interface ApprenticeshipDetails {
  id: string;
  title: string;
  employerName: string;
  description?: string;
  wage?: string;
  hoursPerWeek?: number;
  expectedDuration?: string;
  apprenticeshipLevel?: string;
  postedDate?: string;
  closingDate?: string;
  address?: string;
  postcode?: string;
  providerName?: string;
  // applyUrl is the API's own pre-resolved link; applicationUrl/vacancyUrl are the raw source
  // URLs it also returns, so the page can prefer the employer's application link.
  applyUrl: string;
  applicationUrl?: string;
  vacancyUrl?: string;
}

export type ApprenticeshipDetailsState = 'idle' | 'loading' | 'success' | 'notfound' | 'error';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export function useApprenticeshipDetails(id: string) {
  const [state, setState] = useState<ApprenticeshipDetailsState>('idle');
  const [result, setResult] = useState<ApprenticeshipDetails | null>(null);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    if (!id) {
      setState('notfound');
      return;
    }

    if (!API_BASE_URL) {
      const data = sampleApprenticeshipDetails(id);
      if (data) {
        setResult(data);
        setState('success');
        markApprenticeshipViewed(id);
      } else {
        setState('notfound');
      }
      return;
    }

    setState('loading');
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/apprenticeship/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) {
        setState('notfound');
        return;
      }
      if (!res.ok) {
        setState('error');
        setError('Could not load this apprenticeship. Please try again.');
        return;
      }
      const data = (await res.json()) as ApprenticeshipDetails;
      setResult(data);
      setState('success');
      markApprenticeshipViewed(id);
    } catch {
      setState('error');
      setError('Could not load this apprenticeship. Please try again.');
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { state, result, error, retry: fetchDetails };
}
