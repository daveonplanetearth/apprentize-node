import { useCallback, useEffect, useState } from 'react';

/**
 * `value`, but only once it has stopped changing for `delayMs` — so a search box doesn't search on
 * every keystroke. Returns the settled value and a function that settles a value immediately, for
 * changes that aren't typing (a pressed Search button, a value filled in by the page itself).
 */
export function useDebouncedValue<T>(value: T, delayMs: number): [T, (settled: T) => void] {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  const settleNow = useCallback((settled: T) => setDebounced(settled), []);

  return [debounced, settleNow];
}
