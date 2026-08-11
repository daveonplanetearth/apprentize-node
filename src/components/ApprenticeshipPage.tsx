import {
  ArrowLeft, ArrowUpRight, Share2, Loader2, AlertCircle, Briefcase, Building2,
  TrendingUp, Wallet, Clock, Clock3, CalendarClock, CalendarRange, MapPin,
} from 'lucide-react';
import { useApprenticeshipDetails } from '../hooks/useApprenticeshipDetails';
import type { SortBy, SortOrder } from '../hooks/useApprenticeships';

interface ApprenticeshipPageProps {
  id?: string;
  returnPostcode?: string;
  returnRadiusMiles?: number;
  returnTitle?: string;
  returnSortBy?: SortBy;
  returnSortOrder?: SortOrder;
  returnPage?: number;
}

// Mirrors SearchApprenticeshipsEndpoints.cs's FormatPostedDate — this endpoint returns a raw
// timestamp rather than a pre-formatted string, so the "days ago" phrasing is recomputed here
// to read the same way as the list page.
function formatRelativeDate(iso?: string): string {
  if (!iso) return '';
  const posted = new Date(iso);
  if (Number.isNaN(posted.getTime())) return '';
  const today = new Date();
  const days = Math.round(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(posted.getFullYear(), posted.getMonth(), posted.getDate())) / 86_400_000,
  );
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function formatAbsoluteDate(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

// The canonical, shareable form of this page — a real path rather than the `#/apprenticeship?id=`
// route used for in-app navigation, because link previews and crawlers never see the fragment.
// `App.tsx` resolves both; browsing from the list stays on the hash route so a card click doesn't
// cost a full page load (and can carry the return-to-results state).
function shareUrl(id: string): string {
  return `${window.location.origin}/apprenticeship/${encodeURIComponent(id)}`;
}

// The findapprenticeship.service.gov.uk source data wraps descriptions in markup (e.g. <p></p>)
// rather than sending plain text — convert block breaks to newlines, then strip remaining tags
// and decode entities via the browser's own HTML parser.
function stripHtml(html: string): string {
  const withBreaks = html.replace(/<\/(p|div|li)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n');
  const text = new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent ?? '';
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export default function ApprenticeshipPage({
  id, returnPostcode, returnRadiusMiles, returnTitle, returnSortBy, returnSortOrder, returnPage,
}: ApprenticeshipPageProps) {
  const { state, result, error, retry } = useApprenticeshipDetails(id ?? '');
  const description = result?.description ? stripHtml(result.description) : '';

  // Apply against the employer's own application link where the vacancy has one, falling back to
  // the find-an-apprenticeship listing page (and then to the API's pre-resolved applyUrl, which is
  // all the local dev fixtures carry).
  const applyHref = result?.applicationUrl || result?.vacancyUrl || result?.applyUrl || '';

  // Reconstructs the browse page's last search/page/scroll position, so "Back to results" returns
  // to where the visitor came from rather than resetting to page 1 — falls back to a plain link
  // when there's no return state (e.g. a shared/bookmarked details link opened directly).
  // Root-absolute (`/#/…`) rather than fragment-only, so it still resolves when this page was
  // opened at its shared /apprenticeship/<id> URL instead of the hash route.
  const backHref = returnPostcode
    ? `/#/apprenticeships?${new URLSearchParams({
        postcode: returnPostcode,
        radius: String(returnRadiusMiles ?? ''),
        title: returnTitle ?? '',
        sortBy: returnSortBy ?? '',
        sortOrder: returnSortOrder ?? '',
        page: String(returnPage ?? 1),
        ...(id ? { viewedId: id } : {}),
      }).toString()}`
    : '/#/apprenticeships';

  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-12 overflow-hidden border-b border-line/60">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
          <a
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink transition-colors animate-fade-up"
          >
            <ArrowLeft className="w-4 h-4" /> Back to results
          </a>

          {state === 'success' && result && (
            <div className="mt-4 animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
              <h1 className="font-display font-extrabold text-ink text-3xl sm:text-4xl tracking-tight text-balance">
                {result.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {result.employerName}</span>
                {result.apprenticeshipLevel && (
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {result.apprenticeshipLevel}</span>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {applyHref && (
                  <a
                    href={applyHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-safety text-white font-semibold px-5 py-2.5 text-sm transition-all hover:bg-safety-deep active:scale-[0.98]"
                  >
                    Apply now <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi! I've found an apprenticeship you might be interested in - ${shareUrl(result.id)}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Share ${result.title} on WhatsApp`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal/10 text-teal font-semibold px-5 py-2.5 text-sm hover:bg-teal hover:text-paper transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 sm:px-6 py-8 sm:py-10">
        {state === 'loading' && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-ink-soft/60 animate-spin" />
          </div>
        )}

        {state === 'notfound' && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
              <Briefcase className="w-6 h-6 text-ink-soft/60" />
            </div>
            <p className="font-display font-bold text-ink text-lg">This apprenticeship is no longer available</p>
            <p className="text-ink-soft text-sm mt-1.5 max-w-sm mx-auto">
              It may have closed or been removed. Try browsing current listings instead.
            </p>
            <a
              href={backHref}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              Browse apprenticeships
            </a>
          </div>
        )}

        {state === 'error' && (
          <div className="rounded-2xl bg-safety/5 border border-safety/20 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-safety mx-auto mb-3" />
            <p className="font-display font-bold text-ink text-lg">Something went wrong</p>
            <p className="text-ink-soft text-sm mt-1.5">{error}</p>
            <button
              onClick={retry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {state === 'success' && result && (
          <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
              {description && (
                <>
                  <h2 className="font-display font-bold text-ink text-lg">About this role</h2>
                  <p className="mt-2.5 text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">{description}</p>
                </>
              )}

              {/* The rule only separates the two halves when there's a description above it. */}
              <div
                className={`grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-ink-soft font-mono${
                  description ? ' mt-5 pt-5 border-t border-line' : ''
                }`}
              >
                {result.wage && (
                  <span className="flex items-center gap-2"><Wallet className="w-4 h-4 shrink-0" /> {result.wage}</span>
                )}
                {typeof result.hoursPerWeek === 'number' && (
                  <span className="flex items-center gap-2"><Clock3 className="w-4 h-4 shrink-0" /> {result.hoursPerWeek} hours/week</span>
                )}
                {result.expectedDuration && (
                  <span className="flex items-center gap-2"><CalendarRange className="w-4 h-4 shrink-0" /> {result.expectedDuration}</span>
                )}
                {result.postedDate && (
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" /> Posted {formatRelativeDate(result.postedDate)}</span>
                )}
                {result.closingDate && (
                  <span className="flex items-center gap-2"><CalendarClock className="w-4 h-4 shrink-0" /> Closes {formatAbsoluteDate(result.closingDate)}</span>
                )}
                {(result.address || result.postcode) && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" /> {[result.address, result.postcode].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
