import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import DailyAlerts from './components/DailyAlerts';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import WhatYouGet from './components/WhatYouGet';
import HowToApply from './components/HowToApply';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ApprenticeshipsPage from './components/ApprenticeshipsPage';
import ApprenticeshipPage from './components/ApprenticeshipPage';
import type { SortBy, SortOrder } from './hooks/useApprenticeships';
import { applyAnalyticsSwitch } from './hooks/analytics';
import PreferencesPage from './components/PreferencesPage';
import ConfirmPage from './components/ConfirmPage';
import CheckInboxPage from './components/CheckInboxPage';
import LinkExpiredPage from './components/LinkExpiredPage';
import PrivacyNoticePage from './components/PrivacyNoticePage';
import TermsOfServicePage from './components/TermsOfServicePage';

const SORT_BY_VALUES: SortBy[] = ['postedDate', 'closingDate', 'distance'];
const SORT_ORDER_VALUES: SortOrder[] = ['asc', 'desc'];

// The details page has a second, path-based URL (/apprenticeship/<id>) alongside its hash route:
// link previews (WhatsApp, iMessage, Slack) and crawlers never send the fragment to the server, so
// a shareable link has to carry the id in the path. The Static Web App rewrites unknown paths to
// index.html (`public/staticwebapp.config.json`; `public/web.config` does the same for an App
// Service host), and Vite does the same in dev/preview, so the SPA still boots and the route is
// resolved here.
const DETAILS_PATH = /^\/apprenticeship\/(.+?)\/?$/;

/** "4,7" → [4, 7]. Anything that isn't a positive whole number is dropped, as the API does. */
function parseIds(value: string | null): number[] {
  if (!value) return [];
  return [...new Set(value.split(',').map((s) => Number(s.trim())).filter((n) => Number.isInteger(n) && n > 0))];
}

function decodeSegment(segment: string): string {
  // A hand-edited or truncated URL can leave a malformed escape, which throws.
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

// A hash always wins over the path, so the in-app `#/...` links keep working when the visitor
// landed on a path-based URL (e.g. "Back to results" from a shared details link).
function readRoute(): { path: string; params: URLSearchParams } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    const [path, search] = hash.split('?');
    return { path, params: new URLSearchParams(search ?? '') };
  }

  const match = DETAILS_PATH.exec(window.location.pathname);
  if (match) {
    return { path: 'apprenticeship', params: new URLSearchParams({ id: decodeSegment(match[1]) }) };
  }

  return { path: '', params: new URLSearchParams() };
}

function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
    };
  }, []);
  return route;
}

export default function App() {
  const { path, params } = useRoute();

  // The "don't count me" link (#/?analytics=off, or =on to undo), offered in the privacy notice. A
  // one-off action, so a plain confirmation is enough.
  useEffect(() => {
    const changed = applyAnalyticsSwitch(params);
    if (!changed) return;
    // Take the switch back out of the address bar, so a refresh doesn't ask again.
    const rest = new URLSearchParams(params);
    rest.delete('analytics');
    window.history.replaceState(null, '', `#/${path}${rest.size ? `?${rest.toString()}` : ''}`);
    window.alert(changed === 'off'
      ? 'This browser will no longer be counted in Apprentize usage statistics.'
      : 'This browser will be counted in Apprentize usage statistics again.');
  }, [params, path]);

  useEffect(() => {
    if (path !== 'signup') return;
    const input = document.getElementById('signup-email');
    input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input?.focus();
  }, [path]);

  useEffect(() => {
    if (path !== 'privacy' && path !== 'terms' && path !== 'apprenticeship') return;
    // The two-argument form respects the global `scroll-behavior: smooth` (index.css), which
    // animates instead of jumping — force an instant scroll for a route change.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [path]);

  if (path === 'apprenticeships') {
    const initialPostcode = params.get('postcode') ?? undefined;
    const initialRadiusParam = params.get('radius');
    const initialRadiusMiles = initialRadiusParam ? Number(initialRadiusParam) : undefined;
    const initialTitle = params.get('title') ?? undefined;

    const sortByParam = params.get('sortBy');
    const initialSortBy = SORT_BY_VALUES.includes(sortByParam as SortBy) ? (sortByParam as SortBy) : undefined;
    const sortOrderParam = params.get('sortOrder');
    const initialSortOrder = SORT_ORDER_VALUES.includes(sortOrderParam as SortOrder) ? (sortOrderParam as SortOrder) : undefined;

    const initialPageParam = params.get('page');
    const initialPage = initialPageParam ? Number(initialPageParam) : undefined;
    const initialViewedId = params.get('viewedId') ?? undefined;
    const initialInterests = { routeIds: parseIds(params.get('routes')), larsCodes: parseIds(params.get('courses')) };

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <ApprenticeshipsPage
            initialPostcode={initialPostcode}
            initialRadiusMiles={initialRadiusMiles}
            initialTitle={initialTitle}
            initialSortBy={initialSortBy}
            initialSortOrder={initialSortOrder}
            initialPage={initialPage}
            initialViewedId={initialViewedId}
            initialInterests={initialInterests}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'apprenticeship') {
    const id = params.get('id') ?? undefined;
    const returnPostcode = params.get('postcode') ?? undefined;
    const returnRadiusParam = params.get('radius');
    const returnRadiusMiles = returnRadiusParam ? Number(returnRadiusParam) : undefined;
    const returnTitle = params.get('title') ?? undefined;
    const returnSortByParam = params.get('sortBy');
    const returnSortBy = SORT_BY_VALUES.includes(returnSortByParam as SortBy) ? (returnSortByParam as SortBy) : undefined;
    const returnSortOrderParam = params.get('sortOrder');
    const returnSortOrder = SORT_ORDER_VALUES.includes(returnSortOrderParam as SortOrder) ? (returnSortOrderParam as SortOrder) : undefined;
    const returnPageParam = params.get('page');
    const returnPage = returnPageParam ? Number(returnPageParam) : undefined;
    const returnRoutes = params.get('routes') ?? undefined;
    const returnCourses = params.get('courses') ?? undefined;

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <ApprenticeshipPage
            id={id}
            returnPostcode={returnPostcode}
            returnRadiusMiles={returnRadiusMiles}
            returnTitle={returnTitle}
            returnSortBy={returnSortBy}
            returnSortOrder={returnSortOrder}
            returnPage={returnPage}
            returnRoutes={returnRoutes}
            returnCourses={returnCourses}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'preferences') {
    const manageToken = params.get('token') ?? undefined;

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <PreferencesPage manageToken={manageToken} />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'confirm') {
    const token = params.get('token') ?? undefined;

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <ConfirmPage token={token} />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'check-inbox') {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <CheckInboxPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'link-expired') {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <LinkExpiredPage />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'privacy') {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <PrivacyNoticePage />
        </main>
        <Footer />
      </div>
    );
  }

  if (path === 'terms') {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Nav />
        <main>
          <TermsOfServicePage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav isHome />
      <main>
        <Hero />
        <HowItWorks />
        <DailyAlerts />
        <Stats />
        <WhatYouGet />
        <HowToApply />
        <FAQ />
      </main>
      <Footer isHome />
    </div>
  );
}
