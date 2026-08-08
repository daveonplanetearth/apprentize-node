import { useState, useCallback } from 'react';

export type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

export type SubscribeErrorField = 'postcode' | null;

export type AgeGroup = 'under_16' | '16_17' | '18_plus';

// Matches Apprentize.Core.Models.AgeBand — the API only accepts these two bands
// (SignUpConsentValidator rejects anything else, including under-16, as a silent no-op).
const AGE_BAND_BY_GROUP: Partial<Record<AgeGroup, string>> = {
  '16_17': '16to17',
  '18_plus': '18plus',
};

export interface SubscribePayload {
  email: string;
  source?: string;
  ageBand?: string;
  tosConsent: boolean;
  emailAlertsConsent: boolean;
  postcode?: string;
  searchRadiusMiles?: number;
}

export interface UseSubscribeResult {
  state: SubscribeState;
  message: string;
  errorField: SubscribeErrorField;
  subscribe: (
    email: string,
    source: string | undefined,
    ageGroup: AgeGroup | undefined,
    tosConsent: boolean,
    emailAlertsConsent: boolean,
    postcode?: string,
    radiusMiles?: number,
  ) => Promise<void>;
  reset: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/signup` : undefined;

const DEFAULT_SUCCESS_MESSAGE = "You're in. Check your inbox — we'll email you the moment a match appears.";
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

interface SignupErrorBody {
  error?: string;
  message?: string;
}

export function useSubscribe(): UseSubscribeResult {
  const [state, setState] = useState<SubscribeState>('idle');
  const [message, setMessage] = useState('');
  const [errorField, setErrorField] = useState<SubscribeErrorField>(null);

  const subscribe = useCallback(async (
    email: string,
    source: string | undefined,
    ageGroup: AgeGroup | undefined,
    tosConsent: boolean,
    emailAlertsConsent: boolean,
    postcode?: string,
    radiusMiles?: number,
  ) => {
    setState('loading');
    setMessage('');
    setErrorField(null);

    if (!ENDPOINT) {
      setState('error');
      setMessage('Subscription endpoint is not configured.');
      return;
    }

    const payload: SubscribePayload = {
      email,
      source,
      ageBand: ageGroup ? AGE_BAND_BY_GROUP[ageGroup] : undefined,
      tosConsent,
      emailAlertsConsent,
      postcode: postcode?.trim() || undefined,
      searchRadiusMiles: radiusMiles,
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body: SignupErrorBody | null = await res.json().catch(() => null);
        setState('error');
        if (body?.error === 'invalid_postcode') {
          setErrorField('postcode');
          setMessage(body.message ?? 'Postcode not found. Please check and try again.');
        } else {
          setMessage(DEFAULT_ERROR_MESSAGE);
        }
        return;
      }

      // The API always returns a neutral 200 (it never reveals whether an address
      // is already registered), so any successful response is treated as success.
      setState('success');
      setMessage(DEFAULT_SUCCESS_MESSAGE);
    } catch {
      setState('error');
      setMessage(DEFAULT_ERROR_MESSAGE);
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setMessage('');
    setErrorField(null);
  }, []);

  return { state, message, errorField, subscribe, reset };
}
