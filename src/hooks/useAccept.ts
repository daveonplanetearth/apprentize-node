import { useState, useCallback } from 'react';

export type AcceptState = 'idle' | 'loading' | 'success' | 'error';

export interface AcceptResult {
  redirectUrl: string;
  sessionToken: string;
}

export interface UseAcceptResult {
  state: AcceptState;
  accept: (token: string) => Promise<AcceptResult | null>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/accept` : undefined;

interface AcceptResponse {
  redirectUrl?: string;
  sessionToken?: string;
  error?: string;
}

// Mirrors confirm.js: the API always returns 200, so success vs. failure (expired/used/invalid
// token) is distinguished by the presence of redirectUrl in the body, not by res.ok.
export function useAccept(): UseAcceptResult {
  const [state, setState] = useState<AcceptState>('idle');

  const accept = useCallback(async (token: string): Promise<AcceptResult | null> => {
    setState('loading');

    if (!ENDPOINT) {
      setState('error');
      return null;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setState('error');
        return null;
      }

      const data: AcceptResponse = await res.json();

      if (!data.redirectUrl || !data.sessionToken) {
        setState('error');
        return null;
      }

      setState('success');
      return { redirectUrl: data.redirectUrl, sessionToken: data.sessionToken };
    } catch {
      setState('error');
      return null;
    }
  }, []);

  return { state, accept };
}
