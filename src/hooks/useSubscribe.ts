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
  ageBand?: string;
  tosConsent: boolean;
  emailAlertsConsent: boolean;
  postcode?: string;
  searchRadiusMiles?: number;
  interests?: { routeIds: number[] };
}

export interface UseSubscribeResult {
  state: SubscribeState;
  message: string;
  errorField: SubscribeErrorField;
  subscribe: (
    email: string,
    ageGroup: AgeGroup | undefined,
    tosConsent: boolean,
    emailAlertsConsent: boolean,
    postcode?: string,
    radiusMiles?: number,
    routeIds?: number[],
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

// Errors about the chosen routes. Safe to show as-is: the API answers these before it looks the
// email address up, so they say nothing about whether it is registered.
const INTEREST_ERRORS = new Set(['too_many_interests', 'duplicate_interests', 'invalid_interests', 'unknown_interest']);

export function useSubscribe(): UseSubscribeResult {
  const [state, setState] = useState<SubscribeState>('idle');
  const [message, setMessage] = useState('');
  const [errorField, setErrorField] = useState<SubscribeErrorField>(null);

  const subscribe = useCallback(async (
    email: string,
    ageGroup: AgeGroup | undefined,
    tosConsent: boolean,
    emailAlertsConsent: boolean,
    postcode?: string,
    radiusMiles?: number,
    routeIds?: number[],
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
      ageBand: ageGroup ? AGE_BAND_BY_GROUP[ageGroup] : undefined,
      tosConsent,
      emailAlertsConsent,
      postcode: postcode?.trim() || undefined,
      searchRadiusMiles: radiusMiles,
      interests: routeIds ? { routeIds } : undefined,
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
        } else if (body?.error && INTEREST_ERRORS.has(body.error) && body.message) {
          setMessage(body.message);
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
