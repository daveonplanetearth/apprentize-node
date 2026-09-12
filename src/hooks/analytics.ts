// Anonymous usage statistics are recorded by the API as searches and vacancy views arrive — no
// cookies, no tracking script, nothing identifying anyone (see the privacy notice). This module
// holds the two things only the browser can do: say "don't count this browser" (the opt-out link
// the privacy notice offers anyone, and how the site owner keeps their own testing out), and report
// an "Apply" click, which leaves for the employer's site where the API would never see it.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

const OPT_OUT_KEY = 'apz_analytics';
const OPT_OUT_HEADER = 'X-Apprentize-Analytics';

function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === 'off';
  } catch {
    return false;
  }
}

/**
 * Handles the "don't count me" link: visiting any page with `?analytics=off` in the hash
 * (e.g. https://www.apprentize.co.uk/#/?analytics=off) marks this browser to be left out of the
 * statistics, and `?analytics=on` undoes it. Stored in this browser only. Returns the new setting
 * when the link changed it, so the page can confirm, and null otherwise.
 */
export function applyAnalyticsSwitch(params: URLSearchParams): 'off' | 'on' | null {
  const value = params.get('analytics');
  if (value !== 'off' && value !== 'on') return null;
  try {
    if (value === 'off') localStorage.setItem(OPT_OUT_KEY, 'off');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    return null;
  }
  return value;
}

/** Extra request headers for API calls that are recorded: the opt-out marker, when set. */
export function analyticsHeaders(): Record<string, string> {
  return isOptedOut() ? { [OPT_OUT_HEADER]: 'off' } : {};
}

/**
 * Reports an "Apply" click. Fire-and-forget: `keepalive` lets the request finish even as the
 * browser moves on to the employer's page, and any failure is ignored — it must never get in the
 * way of someone applying.
 */
export function recordApplyClick(vacancyId: string): void {
  if (!API_BASE_URL || isOptedOut()) return;
  try {
    void fetch(`${API_BASE_URL}/api/events/apply`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vacancyId }),
    }).catch(() => {});
  } catch {
    // Ignore.
  }
}
