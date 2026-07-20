import { useState, useCallback } from 'react';

export type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

export type AgeGroup = 'under_16' | '16_17' | '18_plus';

export interface SubscribePayload {
  email: string;
  source?: string;
  ageGroup?: AgeGroup;
  postcode?: string;
  radiusMiles?: number;
}

export interface UseSubscribeResult {
  state: SubscribeState;
  message: string;
  subscribe: (email: string, source?: string, ageGroup?: AgeGroup, postcode?: string, radiusMiles?: number) => Promise<void>;
  reset: () => void;
}

const ENDPOINT = import.meta.env.VITE_AZURE_SUBSCRIBE_URL as string | undefined;

export function useSubscribe(): UseSubscribeResult {
  const [state, setState] = useState<SubscribeState>('idle');
  const [message, setMessage] = useState('');

  const subscribe = useCallback(async (email: string, source?: string, ageGroup?: AgeGroup, postcode?: string, radiusMiles?: number) => {
    setState('loading');
    setMessage('');

    if (!ENDPOINT) {
      setState('error');
      setMessage('Subscription endpoint is not configured.');
      return;
    }

    const payload: SubscribePayload = {
      email,
      source,
      ageGroup: ageGroup || undefined,
      postcode: postcode?.trim() || undefined,
      radiusMiles,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        setState('success');
        setMessage("You're already on the list — we'll be in touch soon.");
        return;
      }

      if (!res.ok) {
        setState('error');
        setMessage('Something went wrong. Please try again.');
        return;
      }

      setState('success');
      setMessage("You're in. Check your inbox — we'll email you the moment a match appears.");
    } catch {
      setState('error');
      setMessage('Something went wrong. Please try again.');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setMessage('');
  }, []);

  return { state, message, subscribe, reset };
}
