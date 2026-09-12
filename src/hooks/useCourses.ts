import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export interface CourseOption {
  larsCode: number;
  title: string;
  level: number | null;
}

export interface RouteOption {
  id: number;
  name: string;
  courses: CourseOption[];
}

export type CoursesState = 'loading' | 'ready' | 'error';

// One request per page load, shared by every component that asks. The list only changes when
// the twice-daily sync changes it, and the API marks it cacheable for an hour anyway.
let routesPromise: Promise<RouteOption[]> | null = null;

function loadRoutes(): Promise<RouteOption[]> {
  if (!routesPromise) {
    routesPromise = (async () => {
      if (!API_BASE_URL) throw new Error('API base URL not configured');
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      if (!res.ok) throw new Error(`Failed to load courses (${res.status})`);
      const data = await res.json();
      return (data.routes ?? []) as RouteOption[];
    })();
    // A failed load shouldn't poison every later attempt on this page.
    routesPromise.catch(() => {
      routesPromise = null;
    });
  }
  return routesPromise;
}

/** The apprenticeship routes (with their active courses) that interests are chosen from. */
export function useCourses() {
  const [state, setState] = useState<CoursesState>('loading');
  const [routes, setRoutes] = useState<RouteOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadRoutes()
      .then((r) => {
        if (cancelled) return;
        setRoutes(r);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { state, routes };
}
