import { useMemo, useState } from 'react';
import { Check, Loader2, AlertCircle, X, Search, Plus } from 'lucide-react';
import {
  MAX_INTERESTS,
  type CourseInfo,
  type CoursesState,
  type InterestSelection,
  type RouteOption,
} from '../hooks/useCourses';

interface InterestPickerProps {
  routes: RouteOption[];
  routesState: CoursesState;
  value: InterestSelection;
  onChange: (next: InterestSelection) => void;
  /**
   * Details of courses already chosen that the route list can't supply — withdrawn courses are
   * no longer in it, but the subscriber still has to see them to replace them.
   */
  chosenCourses?: CourseInfo[];
  /** Off for signup, which keeps to whole routes; narrowing happens on the preferences page. */
  allowCourses?: boolean;
  /** Items allowed in total (routes and courses together). `null` means no cap. */
  max?: number | null;
  disabled?: boolean;
  /** Shown when the route list fails to load — callers say what that means for the user. */
  unavailableMessage?: string;
}

const SEARCH_RESULT_LIMIT = 8;

/** "Software developer (level 4)" → "Software developer"; the level is shown separately. */
function courseName(title: string): string {
  return title.replace(/\s*\(level\s+\d\)\s*$/i, '');
}

/**
 * Choose apprenticeship routes to hear about, and optionally narrow a route down to specific
 * courses. Narrowing replaces the whole route: a route is either chosen whole or through some of
 * its courses, never both. Choosing nothing is meaningful — every apprenticeship in the area.
 */
export default function InterestPicker({
  routes,
  routesState,
  value,
  onChange,
  chosenCourses = [],
  allowCourses = true,
  max = MAX_INTERESTS,
  disabled = false,
  unavailableMessage = "We couldn't load the list of apprenticeship areas right now.",
}: InterestPickerProps) {
  const [searchRouteId, setSearchRouteId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  // Every course the picker might need to name: the live list, plus chosen ones it lacks.
  const courseByCode = useMemo(() => {
    const map = new Map<number, CourseInfo>();
    for (const route of routes) {
      for (const c of route.courses) {
        map.set(c.larsCode, { ...c, routeId: route.id, isActive: true });
      }
    }
    for (const c of chosenCourses) {
      if (!map.has(c.larsCode)) map.set(c.larsCode, c);
    }
    return map;
  }, [routes, chosenCourses]);

  const count = value.routeIds.length + value.larsCodes.length;
  const atCap = max !== null && count >= max;

  const coursesIn = (routeId: number) =>
    value.larsCodes.filter((code) => courseByCode.get(code)?.routeId === routeId);

  const isChosen = (routeId: number) =>
    value.routeIds.includes(routeId) || coursesIn(routeId).length > 0;

  const toggleRoute = (routeId: number) => {
    if (isChosen(routeId)) {
      // Removing a route removes it whole and every course chosen inside it.
      const inRoute = new Set(coursesIn(routeId));
      onChange({
        routeIds: value.routeIds.filter((id) => id !== routeId),
        larsCodes: value.larsCodes.filter((code) => !inRoute.has(code)),
      });
      if (searchRouteId === routeId) setSearchRouteId(null);
    } else if (!atCap) {
      onChange({ ...value, routeIds: [...value.routeIds, routeId] });
    }
  };

  const addCourse = (routeId: number, larsCode: number) => {
    const replacesWholeRoute = value.routeIds.includes(routeId);
    // Swapping a whole route for its first course doesn't change the count, so it's allowed at the cap.
    if (atCap && !replacesWholeRoute) return;
    onChange({
      routeIds: value.routeIds.filter((id) => id !== routeId),
      larsCodes: [...value.larsCodes, larsCode],
    });
    setQuery('');
  };

  const removeCourse = (larsCode: number) =>
    onChange({ ...value, larsCodes: value.larsCodes.filter((code) => code !== larsCode) });

  const widenToWholeRoute = (routeId: number) => {
    const inRoute = new Set(coursesIn(routeId));
    onChange({
      routeIds: [...value.routeIds, routeId],
      larsCodes: value.larsCodes.filter((code) => !inRoute.has(code)),
    });
    setSearchRouteId(null);
  };

  const openSearch = (routeId: number) => {
    setSearchRouteId(routeId);
    setQuery('');
  };

  if (routesState === 'loading') {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-ink-soft">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading apprenticeship areas…
      </div>
    );
  }

  if (routesState === 'error') {
    return (
      <p role="alert" className="flex items-center gap-1.5 py-2 text-sm text-ink-soft">
        <AlertCircle className="w-4 h-4 shrink-0" />
        {unavailableMessage}
      </p>
    );
  }

  const chosenRoutes = routes.filter((r) => isChosen(r.id));
  const knownRouteIds = new Set(routes.map((r) => r.id));
  // Chosen courses whose route isn't in the live list at all — only possible once DfE withdraws
  // the last course in a route. They still need showing so they can be removed.
  const strandedCourses = value.larsCodes.filter((code) => {
    const routeId = courseByCode.get(code)?.routeId;
    return routeId == null || !knownRouteIds.has(routeId);
  });

  const chipBase = 'inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed';

  const renderCourseChip = (larsCode: number) => {
    const course = courseByCode.get(larsCode);
    const withdrawn = course ? !course.isActive : true;
    return (
      <li
        key={larsCode}
        className={`inline-flex items-center gap-2 rounded-lg border pl-3 pr-1.5 py-1.5 text-sm ${
          withdrawn ? 'border-safety/40 bg-safety/5' : 'border-ink/20 bg-ink/5'
        }`}
      >
        <span className="min-w-0">
          <span className={withdrawn ? 'text-ink-soft line-through' : 'text-ink'}>
            {course ? courseName(course.title) : `Course ${larsCode}`}
          </span>
          {course?.level != null && <span className="ml-1.5 text-xs text-ink-soft">Level {course.level}</span>}
          {withdrawn && (
            <span className="block text-xs font-medium text-safety">No longer offered — choose another</span>
          )}
        </span>
        <button
          type="button"
          onClick={() => removeCourse(larsCode)}
          disabled={disabled}
          aria-label={`Remove ${course ? courseName(course.title) : `course ${larsCode}`}`}
          className="shrink-0 rounded-md p-1 text-ink-soft hover:bg-ink/10 hover:text-ink disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </li>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Apprenticeship areas">
        {routes.map((route) => {
          const chosen = isChosen(route.id);
          return (
            <button
              key={route.id}
              type="button"
              aria-pressed={chosen}
              onClick={() => toggleRoute(route.id)}
              disabled={disabled || (!chosen && atCap)}
              className={`${chipBase} ${
                chosen
                  ? 'border-ink bg-ink/5 text-ink ring-2 ring-ink/15'
                  : 'border-line text-ink-soft hover:border-ink/40 hover:bg-paper-deep/40 disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-transparent'
              }`}
            >
              {chosen && <Check className="w-3.5 h-3.5 text-safety" strokeWidth={3} />}
              {route.name}
            </button>
          );
        })}
      </div>

      {allowCourses && (chosenRoutes.length > 0 || strandedCourses.length > 0) && (
        <div className="mt-4 space-y-3">
          {chosenRoutes.map((route) => {
            const whole = value.routeIds.includes(route.id);
            const courses = coursesIn(route.id);
            const searching = searchRouteId === route.id;
            const needle = query.trim().toLowerCase();
            const results = searching
              ? route.courses
                  .filter((c) => !value.larsCodes.includes(c.larsCode))
                  .filter((c) => !needle || c.title.toLowerCase().includes(needle))
                  .slice(0, SEARCH_RESULT_LIMIT)
              : [];
            const canAddCourse = whole || !atCap;

            return (
              <div key={route.id} className="rounded-xl border border-line px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{route.name}</p>
                  {!whole && (
                    <button
                      type="button"
                      onClick={() => widenToWholeRoute(route.id)}
                      disabled={disabled}
                      className="text-xs font-semibold text-teal hover:text-teal-soft disabled:opacity-50"
                    >
                      Use all {route.name} courses instead
                    </button>
                  )}
                </div>

                {whole ? (
                  <p className="mt-1 text-sm text-ink-soft">All courses in this area.</p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">{courses.map(renderCourseChip)}</ul>
                )}

                {!searching && (
                  <button
                    type="button"
                    onClick={() => openSearch(route.id)}
                    disabled={disabled || !canAddCourse}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal hover:text-teal-soft disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {whole ? <><Search className="w-3.5 h-3.5" /> Narrow down to specific courses</> : <><Plus className="w-3.5 h-3.5" /> Add another course</>}
                  </button>
                )}

                {searching && (
                  <div className="mt-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
                      <input
                        type="search"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search ${route.courses.length} ${route.name} courses`}
                        aria-label={`Search ${route.name} courses`}
                        disabled={disabled}
                        className="w-full rounded-lg border border-line bg-paper pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15"
                      />
                    </div>
                    {results.length > 0 ? (
                      <ul className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-line divide-y divide-line">
                        {results.map((c) => (
                          <li key={c.larsCode}>
                            <button
                              type="button"
                              onClick={() => addCourse(route.id, c.larsCode)}
                              disabled={disabled || !canAddCourse}
                              className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-paper-deep/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="text-ink">{courseName(c.title)}</span>
                              {c.level != null && <span className="shrink-0 text-xs text-ink-soft">Level {c.level}</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-ink-soft">No matching courses in {route.name}.</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setSearchRouteId(null)}
                      className="mt-2 text-xs font-semibold text-ink-soft hover:text-ink"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {strandedCourses.length > 0 && (
            <div className="rounded-xl border border-safety/30 px-4 py-3">
              <p className="text-sm font-semibold text-ink">No longer offered</p>
              <ul className="mt-2 flex flex-wrap gap-2">{strandedCourses.map(renderCourseChip)}</ul>
            </div>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-ink-soft" aria-live="polite">
        {count === 0
          ? max === null
            ? 'Choose areas to narrow the results, or leave them all unselected to see everything.'
            : `Leave these unselected to hear about every apprenticeship in your area, or choose up to ${max}.`
          : max === null
            ? `${count} selected.`
            : `${count} of ${max} selected${allowCourses ? ' — each area or course counts as one' : ''}. You'll only hear about apprenticeships you've chosen.`}
      </p>
      {atCap && allowCourses && (
        <p className="mt-1 text-xs text-ink-soft">
          That's the most you can choose — remove one to add another. You can still swap an area for a course inside it.
        </p>
      )}
    </div>
  );
}
