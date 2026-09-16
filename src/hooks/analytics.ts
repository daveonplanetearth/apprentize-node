// Anonymous usage statistics are recorded by the API as searches and vacancy views arrive — no
// cookies, no tracking script, nothing identifying anyone (see the privacy notice). This module
// holds the things only the browser can do: say "don't count this browser" (the opt-out link the
// privacy notice offers anyone, and how the site owner keeps their own testing out), and report the
// two clicks that leave for another site — "Apply now" and "Share on WhatsApp" — which the API
// would otherwise never see.

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
 * Fire-and-forget report of a click that leaves the site: `keepalive` lets the request finish even
 * as the browser moves on, and any failure is ignored — it must never get in the way of what the
 * visitor is doing.
 */
function recordVacancyClick(event: 'apply' | 'share', vacancyId: string): void {
  if (!API_BASE_URL || isOptedOut()) return;
  try {
    void fetch(`${API_BASE_URL}/api/events/${event}`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vacancyId }),
    }).catch(() => {});
  } catch {
    // Ignore.
  }
}

/** Reports an "Apply now" click, which leaves for the employer's own site. */
export function recordApplyClick(vacancyId: string): void {
  recordVacancyClick('apply', vacancyId);
}

/**
 * Reports a "Share on WhatsApp" click. It counts the tap, not a message: WhatsApp opens in its own
 * tab and the site never learns whether anything was sent, or to whom.
 */
export function recordShareClick(vacancyId: string): void {
  recordVacancyClick('share', vacancyId);
}
