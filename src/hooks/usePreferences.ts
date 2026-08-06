import { useState, useCallback, useEffect } from 'react';

// Matches Apprentize.Web's wwwroot/js/api-client.js — same key, so a session token minted by
// this frontend or the .NET one is interchangeable (they hit the same Apprentize.Api backend).
const TOKEN_KEY = 'apz_session_token';

// The native `storage` event only fires in *other* tabs, not the one that made the change —
// this custom event lets same-tab listeners (e.g. Nav/Footer) react immediately too.
const TOKEN_CHANGED_EVENT = 'apz-session-token-changed';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export function getStoredSessionToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredSessionToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
}

function clearStoredSessionToken() {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
}

/** Whether a session token is currently stored — reactive to same-tab and cross-tab changes. */
export function useHasSessionToken(): boolean {
  const [hasToken, setHasToken] = useState(() => Boolean(getStoredSessionToken()));

  useEffect(() => {
    const update = () => setHasToken(Boolean(getStoredSessionToken()));
    window.addEventListener(TOKEN_CHANGED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(TOKEN_CHANGED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return hasToken;
}

async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!API_BASE_URL) throw new Error('API base URL not configured');

  const token = getStoredSessionToken();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401) clearStoredSessionToken();
  return res;
}

export type LoadState = 'loading' | 'ready' | 'unauthorized';

export interface SaveResult {
  ok: boolean;
  message?: string;
}

export interface StoredPreferences {
  postcode: string;
  searchRadiusMiles?: number;
}

/**
 * One-shot lookup of the caller's saved postcode/radius via a session token already in
 * localStorage (no manage-token exchange, no redirect side effects) — for pages like
 * ApprenticeshipsPage that want to silently pre-fill for a signed-in visitor and fall back to
 * anonymous behavior otherwise. Returns null if there's no stored token, the API isn't
 * configured, or the token turns out to be invalid/expired (which also clears it, via apiFetch).
 */
export async function fetchStoredPreferences(): Promise<StoredPreferences | null> {
  if (!API_BASE_URL || !getStoredSessionToken()) return null;

  try {
    const res = await apiFetch('/api/preferences');
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.postcode) return null;

    return { postcode: data.postcode, searchRadiusMiles: data.searchRadiusMiles };
  } catch {
    return null;
  }
}

export function usePreferences(manageToken?: string) {
  const [state, setState] = useState<LoadState>('loading');
  const [postcode, setPostcode] = useState('');
  const [searchRadiusMiles, setSearchRadiusMiles] = useState(15);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!API_BASE_URL || (!manageToken && !getStoredSessionToken())) {
        setState('unauthorized');
        return;
      }

      try {
        const path = manageToken
          ? `/api/preferences?token=${encodeURIComponent(manageToken)}`
          : '/api/preferences';
        const res = await apiFetch(path);

        // The manage token has now been exchanged for a session token (if valid) — drop it
        // from the visible URL so it doesn't linger in browser history.
        if (manageToken) {
          window.history.replaceState(null, '', '#/preferences');
        }

        if (!res.ok) {
          if (!cancelled) setState('unauthorized');
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        if (data.sessionToken) setStoredSessionToken(data.sessionToken);
        if (data.postcode) setPostcode(data.postcode);
        if (data.searchRadiusMiles) setSearchRadiusMiles(data.searchRadiusMiles);
        setState('ready');
      } catch {
        if (!cancelled) setState('unauthorized');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [manageToken]);

  const save = useCallback(async (nextPostcode: string, nextRadiusMiles: number): Promise<SaveResult> => {
    try {
      const res = await apiFetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode: nextPostcode, searchRadiusMiles: nextRadiusMiles }),
      });

      if (res.ok) {
        setPostcode(nextPostcode);
        setSearchRadiusMiles(nextRadiusMiles);
        return { ok: true };
      }

      if (res.status === 401) {
        setState('unauthorized');
        return { ok: false, message: 'Your session has expired.' };
      }

      const data = await res.json().catch(() => null);
      return { ok: false, message: data?.message ?? 'Something went wrong. Please try again.' };
    } catch {
      return { ok: false, message: 'Something went wrong. Please try again.' };
    }
  }, []);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    try {
      const res = await apiFetch('/api/unsubscribe', { method: 'POST' });
      if (res.ok || res.status === 401) {
        clearStoredSessionToken();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      const res = await apiFetch('/api/delete', { method: 'POST' });
      if (res.ok) {
        clearStoredSessionToken();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiFetch('/api/logout', { method: 'POST' });
    } catch {
      // fall through — caller redirects regardless
    }
    clearStoredSessionToken();
  }, []);

  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      await apiFetch('/api/logout-all', { method: 'POST' });
    } catch {
      // fall through — caller redirects regardless
    }
    clearStoredSessionToken();
  }, []);

  return { state, postcode, searchRadiusMiles, save, unsubscribe, deleteAccount, logout, logoutAll };
}
