import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  MapPin, Search, ChevronLeft, ChevronRight, Briefcase, Building2,
  TrendingUp, Clock, Loader2, AlertCircle, Ruler, X, LocateFixed,
  ArrowUpDown, CalendarClock, Users, SlidersHorizontal, ChevronDown,
} from 'lucide-react';
import { useApprenticeships } from '../hooks/useApprenticeships';
import type { SortBy, SortOrder } from '../hooks/useApprenticeships';
import { getStoredSessionToken, fetchStoredPreferences } from '../hooks/usePreferences';
import { useViewedApprenticeships } from '../hooks/useViewedApprenticeships';
import { NO_INTERESTS, useCourses, type CourseInfo, type InterestSelection, type RouteOption } from '../hooks/useCourses';
import InterestPicker from './InterestPicker';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { canUseMyLocation, useMyLocation } from '../hooks/useMyLocation';

// How long typing in the postcode or job-title box must pause before the page searches.
const TYPING_PAUSE_MS = 500;

// 25 is included alongside the page's own wider options so a saved preference of 25 miles
// (the largest radius /api/preferences accepts) still matches a real <option>.
const RADIUS_OPTIONS = [5, 10, 15, 20, 25, 30, 50] as const;
const DEFAULT_RADIUS = 15;
const DEFAULT_POSTCODE = 'SW1A 1AA';
const PAGE_SIZE = 8;

const SORT_BY_OPTIONS: { value: SortBy; label: string }[] = [
  { value: 'postedDate', label: 'Posted date' },
  { value: 'closingDate', label: 'Closing date' },
  { value: 'distance', label: 'Distance' },
];

const SORT_ORDER_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' },
];

interface ApprenticeshipsPageProps {
  initialPostcode?: string;
  initialRadiusMiles?: number;
  initialTitle?: string;
  initialSortBy?: SortBy;
  initialSortOrder?: SortOrder;
  initialPage?: number;
  initialViewedId?: string;
  /** Route/course filter from the URL — e.g. an alert email's link, filtered like the email. */
  initialInterests?: InterestSelection;
}

function hasInterests(i: InterestSelection): boolean {
  return i.routeIds.length > 0 || i.larsCodes.length > 0;
}

/** Human names for a filter: route names, then course names (without DfE's "(level N)"). */
function describeInterests(i: InterestSelection, routes: RouteOption[], chosenCourses: CourseInfo[]): string[] {
  const courseName = (code: number) => {
    for (const r of routes) {
      const c = r.courses.find((x) => x.larsCode === code);
      if (c) return c.title;
    }
    return chosenCourses.find((c) => c.larsCode === code)?.title ?? `Course ${code}`;
  };
  return [
    ...i.routeIds.map((id) => routes.find((r) => r.id === id)?.name ?? `Area ${id}`),
    ...i.larsCodes.map((code) => courseName(code).replace(/\s*\(level\s+\d\)\s*$/i, '')),
  ];
}

// Matches the exact strings SearchApprenticeshipsEndpoints.cs's FormatPostedDate emits
// ("Today", "1 day ago", "N days ago") — postedDate arrives pre-formatted, not as a raw date.
function isRecentlyPosted(postedDate: string): boolean {
  if (postedDate === 'Today') return true;
  const match = /^(\d+) days? ago$/.exec(postedDate);
  return match ? Number(match[1]) <= 2 : false;
}

export default function ApprenticeshipsPage({
  initialPostcode, initialRadiusMiles, initialTitle, initialSortBy, initialSortOrder,
  initialPage, initialViewedId, initialInterests = NO_INTERESTS,
}: ApprenticeshipsPageProps) {
  // An explicit postcode in the URL (e.g. from the signup form's "browse now" link) always wins.
  // Otherwise, if the visitor has a saved session (from the preferences/manage-link flow), defer
  // the default search until we know whether we can pre-fill from their saved preferences.
  const [awaitingStoredPreferences] = useState(() => !initialPostcode && Boolean(getStoredSessionToken()));

  const [postcode, setPostcode] = useState(() => initialPostcode || (awaitingStoredPreferences ? '' : DEFAULT_POSTCODE));
  const [radiusMiles, setRadiusMiles] = useState<number>(initialRadiusMiles || DEFAULT_RADIUS);
  const [title, setTitle] = useState(initialTitle || '');
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy || 'distance');
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder || 'asc');
  const [page, setPage] = useState(initialPage && initialPage > 0 ? initialPage : 1);
  const [hasSearched, setHasSearched] = useState(!awaitingStoredPreferences);
  const [interests, setInterests] = useState<InterestSelection>(initialInterests);
  // Set when the filter came from the visitor's own saved interests, so the page can say so.
  const [interestsAreSaved, setInterestsAreSaved] = useState(false);
  const [chosenCourses, setChosenCourses] = useState<CourseInfo[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const { state: routesState, routes } = useCourses();
  const filtered = hasInterests(interests);

  const viewedIds = useViewedApprenticeships();
  const myLocation = useMyLocation();
  const locating = myLocation.state === 'loading';
  const postcodeInput = useRef<HTMLInputElement>(null);

  // Typed fields search once typing pauses, not on every keystroke: one search instead of one per
  // character, for the API, the postcode lookup and the usage statistics alike.
  const [searchPostcode, settlePostcode] = useDebouncedValue(postcode, TYPING_PAUSE_MS);
  const [searchTitle, settleTitle] = useDebouncedValue(title, TYPING_PAUSE_MS);

  const { state, result, error, retry } = useApprenticeships({
    postcode: searchPostcode,
    radiusMiles,
    title: searchTitle,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
    routeIds: interests.routeIds,
    larsCodes: interests.larsCodes,
    enabled: hasSearched,
  });

  // If a saved session exists, silently pull the visitor's postcode/radius from /api/preferences
  // and search with those — same idea as AvailableApprenticeships.cshtml's session-aware
  // pre-fill, just layered on top of this page's own public search rather than replacing it.
  // Their saved interests come too, so a subscriber's view matches their alerts by default; "Show
  // all" below widens it without touching what they saved.
  useEffect(() => {
    if (!awaitingStoredPreferences) return;
    let cancelled = false;

    (async () => {
      const prefs = await fetchStoredPreferences();
      if (cancelled) return;

      // Filled in by the page, not typed, so there's nothing to wait for.
      const prefilledPostcode = prefs?.postcode || DEFAULT_POSTCODE;
      setPostcode(prefilledPostcode);
      settlePostcode(prefilledPostcode);
      if (prefs?.searchRadiusMiles) setRadiusMiles(prefs.searchRadiusMiles);
      if (prefs && !hasInterests(initialInterests) && hasInterests(prefs.interests)) {
        setInterests(prefs.interests);
        setChosenCourses(prefs.chosenCourses);
        setInterestsAreSaved(true);
      }
      setHasSearched(true);
    })();

    return () => {
      cancelled = true;
    };
    // Runs once on mount only — awaitingStoredPreferences is fixed for the component's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to page 1 when filters actually change (after first search) — compares against the
  // previous values rather than a "first run" flag so an initialPage carried over from a "Back to
  // results" link survives React StrictMode's double-invoked mount effect in development.
  const interestsKey = `${interests.routeIds.join(',')}|${interests.larsCodes.join(',')}`;
  const prevFilters = useRef({ postcode, radiusMiles, title, sortBy, sortOrder, interestsKey });
  useEffect(() => {
    const prev = prevFilters.current;
    const changed = prev.postcode !== postcode || prev.radiusMiles !== radiusMiles || prev.title !== title
      || prev.sortBy !== sortBy || prev.sortOrder !== sortOrder || prev.interestsKey !== interestsKey;
    prevFilters.current = { postcode, radiusMiles, title, sortBy, sortOrder, interestsKey };
    if (changed && hasSearched) setPage(1);
  }, [postcode, radiusMiles, title, sortBy, sortOrder, interestsKey, hasSearched]);

  // Keep the address bar in step with the search, so a refresh or a shared link shows the same
  // results — filter included. replaceState fires no hashchange, so this doesn't re-route.
  useEffect(() => {
    if (!hasSearched || !postcode.trim()) return;
    const params = new URLSearchParams({
      postcode: postcode.trim(),
      radius: String(radiusMiles),
      sortBy,
      sortOrder,
      page: String(page),
    });
    if (title.trim()) params.set('title', title.trim());
    if (interests.routeIds.length) params.set('routes', interests.routeIds.join(','));
    if (interests.larsCodes.length) params.set('courses', interests.larsCodes.join(','));
    window.history.replaceState(null, '', `#/apprenticeships?${params.toString()}`);
  }, [hasSearched, postcode, radiusMiles, title, sortBy, sortOrder, page, interests]);

  const showAll = () => {
    setInterests(NO_INTERESTS);
    setInterestsAreSaved(false);
  };

  const interestLabels = filtered ? describeInterests(interests, routes, chosenCourses) : [];

  // Scroll the previously-viewed listing into view once, when returning from its details page.
  const hasScrolledToViewed = useRef(false);
  useEffect(() => {
    if (hasScrolledToViewed.current || !initialViewedId || state !== 'success' || !result) return;
    hasScrolledToViewed.current = true;
    document.getElementById(`job-${initialViewedId}`)?.scrollIntoView({ block: 'center' });
  }, [initialViewedId, state, result]);

  // The nearest postcode goes in the box and searches straight away, like a typed one that's done.
  const handleUseMyLocation = async () => {
    const found = await myLocation.locate();
    if (found) {
      setPostcode(found);
      settlePostcode(found);
      setHasSearched(true);
    } else {
      postcodeInput.current?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    setHasSearched(true);
    setPage(1);
    // Pressing Search doesn't wait for the typing pause. If the settled values change, that
    // change runs the search; if they were already settled, search again explicitly.
    if (postcode === searchPostcode && title === searchTitle) {
      retry();
    } else {
      settlePostcode(postcode);
      settleTitle(title);
    }
  };

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1;
  const canPrev = page > 1;
  const canNext = page < totalPages && (result?.items.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Header */}
      <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-12 overflow-hidden border-b border-line/60">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">Browse live listings</p>
          <h1 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            Apprenticeships near you
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed max-w-2xl text-pretty">
            Search live apprenticeship vacancies by postcode, radius and job title. Results update as you refine your search.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-8 sm:py-10">
        {/* Filter bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-4 sm:p-5"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Postcode */}
            <div className="relative">
              <label className="block text-xs font-semibold text-ink-soft mb-1.5 px-1">Postcode</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
                <input
                  ref={postcodeInput}
                  type="text"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value);
                    if (myLocation.state === 'error') myLocation.reset();
                  }}
                  placeholder="e.g. SW1A 1AA or SW1A"
                  aria-label="Postcode"
                  className={`w-full rounded-xl border border-line bg-paper pl-10 ${canUseMyLocation ? 'pr-16' : 'pr-9'} py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {postcode && (
                    <button
                      type="button"
                      onClick={() => setPostcode('')}
                      aria-label="Clear postcode"
                      className="text-ink-soft/50 hover:text-ink p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {canUseMyLocation && (
                    <button
                      type="button"
                      onClick={handleUseMyLocation}
                      disabled={locating}
                      aria-label={locating ? 'Finding your location' : 'Use my location'}
                      title="Use my location"
                      className="text-ink-soft/70 hover:text-safety p-0.5 disabled:cursor-wait"
                    >
                      {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
              {myLocation.state === 'error' && (
                <p role="alert" className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-medium text-safety">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {myLocation.error}
                </p>
              )}
            </div>

            {/* Radius */}
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1.5 px-1">Radius</label>
              <div className="relative">
                <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
                <select
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Number(e.target.value))}
                  aria-label="Search radius"
                  className="w-full appearance-none rounded-xl border border-line bg-paper pl-10 pr-9 py-3 text-sm text-ink transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                >
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r} value={r}>{r} miles</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4" /></svg>
              </div>
            </div>

            {/* Title search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs font-semibold text-ink-soft mb-1.5 px-1">Job title</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. software, carpentry…"
                  aria-label="Job title search"
                  className="w-full rounded-xl border border-line bg-paper pl-10 pr-9 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                />
                {title && (
                  <button
                    type="button"
                    onClick={() => setTitle('')}
                    aria-label="Clear title"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft/50 hover:text-ink p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Search button */}
            <div className="flex items-end lg:col-span-1">
              <button
                type="submit"
                disabled={!postcode.trim() || state === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-safety text-white font-semibold px-6 py-3 text-sm transition-all hover:bg-safety-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {state === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><Search className="w-4 h-4" /> Search</>
                )}
              </button>
            </div>
          </div>

          {/* Area/course filter — same rule as the alerts, and no cap here */}
          <div className="mt-4 border-t border-line pt-3">
            <button
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              aria-expanded={filterOpen}
              className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-teal transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter by area or course
              {filtered && (
                <span className="rounded-full bg-safety/10 px-2 py-0.5 text-xs font-bold text-safety">
                  {interests.routeIds.length + interests.larsCodes.length}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="mt-3">
                <InterestPicker
                  routes={routes}
                  routesState={routesState}
                  value={interests}
                  onChange={(next) => {
                    setInterests(next);
                    setInterestsAreSaved(false);
                  }}
                  chosenCourses={chosenCourses}
                  max={null}
                  unavailableMessage="We couldn't load the list of apprenticeship areas right now, so results aren't filtered by area."
                />
              </div>
            )}
          </div>
        </form>

        {filtered && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-teal/20 bg-teal/5 px-4 py-3 text-sm">
            <span className="text-ink-soft">
              {interestsAreSaved ? 'Showing your interests:' : 'Showing:'}{' '}
              <span className="font-semibold text-ink">{interestLabels.join(', ')}</span>
            </span>
            <button
              type="button"
              onClick={showAll}
              className="font-semibold text-teal hover:text-teal-soft underline underline-offset-2"
            >
              Show all apprenticeships in this area
            </button>
          </div>
        )}

        {/* Results */}
        <div className="mt-6">
          {/* Idle state — waiting on a saved session's preferences */}
          {!hasSearched && awaitingStoredPreferences && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-ink-soft/60 animate-spin" />
            </div>
          )}

          {/* Idle state */}
          {!hasSearched && !awaitingStoredPreferences && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
                <Search className="w-6 h-6 text-ink-soft/60" />
              </div>
              <p className="font-display font-bold text-ink text-lg">Enter a postcode to begin</p>
              <p className="text-ink-soft text-sm mt-1.5 max-w-sm mx-auto">We'll show apprenticeships within your chosen radius, filtered by title.</p>
            </div>
          )}

          {/* Loading state */}
          {hasSearched && state === 'loading' && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-line bg-card p-4 animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-paper-deep" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/2 rounded bg-paper-deep" />
                      <div className="h-3 w-1/3 rounded bg-paper-deep" />
                      <div className="h-3 w-1/4 rounded bg-paper-deep" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {hasSearched && state === 'error' && (
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

          {/* Success — empty */}
          {hasSearched && state === 'success' && result && result.items.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
                <Briefcase className="w-6 h-6 text-ink-soft/60" />
              </div>
              <p className="font-display font-bold text-ink text-lg">No apprenticeships found</p>
              <p className="text-ink-soft text-sm mt-1.5 max-w-sm mx-auto">
                {filtered
                  ? 'Nothing in the areas or courses you chose right now. Try widening your radius, or show everything in this area.'
                  : 'Try widening your radius or removing the title filter.'}
              </p>
              {filtered && (
                <button
                  type="button"
                  onClick={showAll}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors"
                >
                  Show all apprenticeships in this area
                </button>
              )}
            </div>
          )}

          {/* Success — results */}
          {hasSearched && state === 'success' && result && result.items.length > 0 && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{result.total}</span> apprenticeship{result.total === 1 ? '' : 's'} within <span className="font-semibold text-ink">{radiusMiles} miles</span> of <span className="font-semibold text-ink">{postcode}</span>
                  {title.trim() && <> matching <span className="font-semibold text-ink">"{title.trim()}"</span></>}
                  {filtered && <> in your chosen areas</>}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <CalendarClock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-soft/60 pointer-events-none" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      aria-label="Sort by"
                      className="appearance-none rounded-lg border border-line bg-card pl-8 pr-7 py-1.5 text-xs font-medium text-ink transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                    >
                      {SORT_BY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-soft/60 pointer-events-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4" /></svg>
                  </div>
                  <div className="relative">
                    <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-soft/60 pointer-events-none" />
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                      aria-label="Sort order"
                      className="appearance-none rounded-lg border border-line bg-card pl-8 pr-7 py-1.5 text-xs font-medium text-ink transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                    >
                      {SORT_ORDER_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-soft/60 pointer-events-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4" /></svg>
                  </div>
                  <p className="text-xs text-ink-soft font-mono">Page {page} of {totalPages}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {result.items.map((job) => {
                  const viewed = viewedIds.has(job.id);
                  const detailHref = `#/apprenticeship?${new URLSearchParams({
                    id: job.id,
                    postcode,
                    radius: String(radiusMiles),
                    title,
                    sortBy,
                    sortOrder,
                    page: String(page),
                    ...(interests.routeIds.length ? { routes: interests.routeIds.join(',') } : {}),
                    ...(interests.larsCodes.length ? { courses: interests.larsCodes.join(',') } : {}),
                  }).toString()}`;
                  return (
                  <li
                    key={job.id}
                    id={`job-${job.id}`}
                    className="group rounded-2xl border border-line bg-card p-4 sm:p-5 hover:border-ink/30 hover:shadow-[0_8px_30px_rgba(22,35,59,0.08)] transition-all"
                  >
                    <div className={`flex items-start gap-3.5 ${viewed ? 'opacity-70' : ''}`}>
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="min-w-0">
                            <a href={detailHref} className="group/title flex items-center gap-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
                              <p className="font-semibold text-ink text-base line-clamp-2 group-hover/title:underline underline-offset-2">{job.title}</p>
                              {isRecentlyPosted(job.postedDate) && (
                                <span className="hidden sm:inline-flex shrink-0 text-[10px] font-bold uppercase tracking-wider text-safety bg-safety/10 px-1.5 py-0.5 rounded">New</span>
                              )}
                              {viewed && (
                                <span className="hidden sm:inline-flex shrink-0 text-[10px] font-bold uppercase tracking-wider text-ink-soft bg-ink/5 px-1.5 py-0.5 rounded">Viewed</span>
                              )}
                            </a>
                            <p className="text-sm text-ink-soft mt-0.5 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" /> {job.company}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {isRecentlyPosted(job.postedDate) && (
                              <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-safety bg-safety/10 px-1.5 py-0.5 rounded">New</span>
                            )}
                            {viewed && (
                              <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-ink-soft bg-ink/5 px-1.5 py-0.5 rounded">Viewed</span>
                            )}
                            <a
                              href={detailHref}
                              className="inline-flex items-center gap-1 rounded-lg bg-ink/5 text-ink px-3 py-2 text-xs font-semibold hover:bg-ink hover:text-paper transition-colors"
                            >
                              View
                            </a>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-ink-soft font-mono">
                          <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {job.level}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}{typeof job.distanceMiles === 'number' && <> · {job.distanceMiles.toFixed(1)} mile{job.distanceMiles === 1 ? '' : 's'}</>}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.postedDate}</span>
                          {job.closingDate && <span className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> Closes {job.closingDate}</span>}
                          {typeof job.numberOfPositions === 'number' && job.numberOfPositions > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" /> {job.numberOfPositions} position{job.numberOfPositions === 1 ? '' : 's'}
                            </span>
                          )}
                          {job.wage && <span>{job.wage}</span>}
                        </div>
                      </div>
                    </div>
                  </li>
                  );
                })}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!canPrev}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      const near = Math.abs(p - page) <= 2 || p === 1 || p === totalPages;
                      if (!near) {
                        if (p === page - 3 || p === page + 3) {
                          return <span key={p} className="px-1 text-ink-soft/50 text-sm">…</span>;
                        }
                        return null;
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                            p === page
                              ? 'bg-ink text-paper'
                              : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!canNext}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-3.5 py-2 text-sm font-medium text-ink hover:border-ink/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
