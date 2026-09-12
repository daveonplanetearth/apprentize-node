import { Check, Loader2, AlertCircle } from 'lucide-react';
import type { CoursesState, RouteOption } from '../hooks/useCourses';

export const MAX_INTERESTS = 5;

interface RouteInterestPickerProps {
  routes: RouteOption[];
  routesState: CoursesState;
  selectedRouteIds: number[];
  onChange: (routeIds: number[]) => void;
  disabled?: boolean;
  /** Shown when the route list fails to load — callers say what that means for the user. */
  unavailableMessage?: string;
}

/**
 * Toggle buttons for choosing which apprenticeship routes to get alerts about. Choosing none is
 * meaningful — it means every apprenticeship in the subscriber's area — so nothing is required.
 */
export default function RouteInterestPicker({
  routes,
  routesState,
  selectedRouteIds,
  onChange,
  disabled = false,
  unavailableMessage = "We couldn't load the list of apprenticeship areas right now.",
}: RouteInterestPickerProps) {
  const atCap = selectedRouteIds.length >= MAX_INTERESTS;

  const toggle = (id: number) => {
    if (selectedRouteIds.includes(id)) {
      onChange(selectedRouteIds.filter((r) => r !== id));
    } else if (!atCap) {
      onChange([...selectedRouteIds, id]);
    }
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

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Apprenticeship areas">
        {routes.map((route) => {
          const selected = selectedRouteIds.includes(route.id);
          const unavailable = disabled || (!selected && atCap);
          return (
            <button
              key={route.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(route.id)}
              disabled={unavailable}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed ${
                selected
                  ? 'border-ink bg-ink/5 text-ink ring-2 ring-ink/15'
                  : 'border-line text-ink-soft hover:border-ink/40 hover:bg-paper-deep/40 disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-transparent'
              }`}
            >
              {selected && <Check className="w-3.5 h-3.5 text-safety" strokeWidth={3} />}
              {route.name}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-soft" aria-live="polite">
        {selectedRouteIds.length === 0
          ? `Leave these unselected to hear about every apprenticeship in your area, or choose up to ${MAX_INTERESTS}.`
          : `${selectedRouteIds.length} of ${MAX_INTERESTS} selected. You'll only hear about apprenticeships in these areas.`}
      </p>
    </div>
  );
}
