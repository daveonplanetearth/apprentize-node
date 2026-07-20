import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

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

export function useSubscribe(): UseSubscribeResult {
  const [state, setState] = useState<SubscribeState>('idle');
  const [message, setMessage] = useState('');

  const subscribe = useCallback(async (email: string, source?: string, ageGroup?: AgeGroup, postcode?: string, radiusMiles?: number) => {
    setState('loading');
    setMessage('');

    const { error } = await supabase
      .from('subscribers')
      .insert({
        email,
        source,
        age_group: ageGroup ?? null,
        postcode: postcode?.trim() || null,
        radius_miles: radiusMiles ?? null,
      });

    if (error) {
      // Unique constraint violation = already subscribed
      if (error.code === '23505') {
        setState('success');
        setMessage("You're already on the list — we'll be in touch soon.");
        return;
      }
      setState('error');
      setMessage('Something went wrong. Please try again.');
      return;
    }

    setState('success');
    setMessage("You're in. Check your inbox — we'll email you the moment a match appears.");
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setMessage('');
  }, []);

  return { state, message, subscribe, reset };
}
