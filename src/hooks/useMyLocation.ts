import { useState, useCallback } from 'react';

export type LocateState = 'idle' | 'loading' | 'success' | 'error';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const ENDPOINT = API_BASE_URL ? `${API_BASE_URL}/api/postcodes/nearest` : undefined;

// With no API configured the browse page shows sample data, so "Use my location" still asks the
// browser for a position (exercising the permission flow) and then fills in this sample postcode.
const SAMPLE_POSTCODE = 'SW1A 1AA';

const BLOCKED_MESSAGE = 'Location access is blocked — enter your post code instead.';
const FAILED_MESSAGE = "We couldn't get your location — enter your post code instead.";

// Coarse is plenty for the nearest postcode and much faster on phones; a position from the last
// five minutes is as good as a fresh one.
const POSITION_OPTIONS: PositionOptions = { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 };

/** Whether this browser can offer "Use my location" at all — hide the button when it can't. */
export const canUseMyLocation = typeof navigator !== 'undefined' && 'geolocation' in navigator;

function currentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, POSITION_OPTIONS));
}

/**
 * "Use my location": asks the browser for the device's position (only when called — never on page
 * load) and turns it into the nearest postcode through the API, which the caller then searches with
 * like a typed one. The coordinates go to the API in a POST body and nowhere else.
 */
export function useMyLocation() {
  const [state, setState] = useState<LocateState>('idle');
  const [error, setError] = useState('');

  /** The nearest postcode, or null on failure (with `error` set for the visitor). */
  const locate = useCallback(async (): Promise<string | null> => {
    setState('loading');
    setError('');

    const fail = (message: string) => {
      setState('error');
      setError(message);
      return null;
    };

    let position: GeolocationPosition;
    try {
      position = await currentPosition();
    } catch (e) {
      const denied = (e as GeolocationPositionError | undefined)?.code === 1; // PERMISSION_DENIED
      return fail(denied ? BLOCKED_MESSAGE : FAILED_MESSAGE);
    }

    if (!ENDPOINT) {
      setState('success');
      return SAMPLE_POSTCODE;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      });
      if (!res.ok) return fail(FAILED_MESSAGE);
      const data = (await res.json()) as { postcode?: string };
      if (!data.postcode) return fail(FAILED_MESSAGE);
      setState('success');
      return data.postcode;
    } catch {
      return fail(FAILED_MESSAGE);
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setError('');
  }, []);

  return { state, error, locate, reset };
}
