import { useState, useEffect, FormEvent } from 'react';
import {
  MapPin, Search, ChevronLeft, ChevronRight, Briefcase, Building2,
  TrendingUp, Clock, ArrowUpRight, Loader2, AlertCircle, Ruler, X, Share2,
  ArrowUpDown, CalendarClock,
} from 'lucide-react';
import { useApprenticeships } from '../hooks/useApprenticeships';
import type { SortBy, SortOrder } from '../hooks/useApprenticeships';

const RADIUS_OPTIONS = [5, 10, 15, 20, 30, 50] as const;
const DEFAULT_RADIUS = 15;
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
}

export default function ApprenticeshipsPage({ initialPostcode, initialRadiusMiles }: ApprenticeshipsPageProps) {
  const [postcode, setPostcode] = useState(initialPostcode || 'SW1A 1AA');
  const [radiusMiles, setRadiusMiles] = useState<number>(initialRadiusMiles || DEFAULT_RADIUS);
  const [title, setTitle] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(true);

  const { state, result, error, retry } = useApprenticeships({
    postcode,
    radiusMiles,
    title,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
    enabled: hasSearched,
  });

  // Reset to page 1 when filters change (after first search)
  useEffect(() => {
    if (hasSearched) setPage(1);
  }, [postcode, radiusMiles, title, sortBy, sortOrder, hasSearched]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    setHasSearched(true);
    setPage(1);
    retry();
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
          <p className="text-sm font-bold uppercase tracking-widest text-safety animate-fade-up">Browse live listings</p>
          <h1 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
            Apprenticeships near you
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed max-w-2xl text-pretty animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Search live apprenticeship vacancies by postcode, radius and job title. Results update as you refine your search.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-8 sm:py-10">
        {/* Filter bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-4 sm:p-5 animate-fade-up"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Postcode */}
            <div className="relative">
              <label className="block text-xs font-semibold text-ink-soft mb-1.5 px-1">Postcode</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  aria-label="Postcode"
                  className="w-full rounded-xl border border-line bg-paper pl-10 pr-9 py-3 text-sm text-ink placeholder:text-ink-soft/50 transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                />
                {postcode && (
                  <button
                    type="button"
                    onClick={() => setPostcode('')}
                    aria-label="Clear postcode"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft/50 hover:text-ink p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
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
        </form>

        {/* Results */}
        <div className="mt-6">
          {/* Idle state */}
          {!hasSearched && (
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
                Try widening your radius or removing the title filter.
              </p>
            </div>
          )}

          {/* Success — results */}
          {hasSearched && state === 'success' && result && result.items.length > 0 && (
            <>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <p className="text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{result.total}</span> apprenticeship{result.total === 1 ? '' : 's'} within <span className="font-semibold text-ink">{radiusMiles} miles</span> of <span className="font-semibold text-ink">{postcode}</span>
                  {title.trim() && <> matching <span className="font-semibold text-ink">"{title.trim()}"</span></>}
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
                {result.items.map((job, i) => (
                  <li
                    key={job.id}
                    className="group rounded-2xl border border-line bg-card p-4 sm:p-5 hover:border-ink/30 hover:shadow-[0_8px_30px_rgba(22,35,59,0.08)] transition-all animate-fade-up"
                    style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s`, opacity: 0 }}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-ink text-base truncate">{job.title}</p>
                            <p className="text-sm text-ink-soft mt-0.5 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" /> {job.company}
                            </p>
                          </div>
                          {job.url && (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-ink/5 text-ink px-3 py-2 text-xs font-semibold hover:bg-ink hover:text-paper transition-colors"
                            >
                              View <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Apprenticeship: ${job.title} at ${job.company} (${job.level}) — ${job.location}${job.url ? ` ${job.url}` : ''}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Share ${job.title} on WhatsApp`}
                            className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-teal/10 text-teal px-3 py-2 text-xs font-semibold hover:bg-teal hover:text-paper transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-ink-soft font-mono">
                          <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {job.level}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}{typeof job.distanceMiles === 'number' && <> · {job.distanceMiles.toFixed(1)} mi</>}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.postedDate}</span>
                          {job.closingDate && <span className="flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> Closes {job.closingDate}</span>}
                          {job.wage && <span>{job.wage}</span>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
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
