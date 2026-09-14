import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UrlStateShape = Record<string, string | number>;

/**
 * Two-way binds a typed object to the URL query string, so a filtered/sorted
 * view is a shareable link and survives a refresh. Values equal to their default
 * are omitted to keep the URL clean; numbers are coerced based on the defaults.
 *
 * Pass a **stable** `defaults` object (define it at module scope) — it is used as
 * a dependency for memoization.
 */
export function useUrlState<T extends UrlStateShape>(
  defaults: T,
): readonly [T, (patch: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo(() => {
    const next = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const raw = searchParams.get(key);
      if (raw === null) continue;
      if (typeof defaults[key] === 'number') {
        const num = Number(raw);
        next[key as keyof T] = (Number.isFinite(num) ? num : defaults[key]) as T[keyof T];
      } else {
        next[key as keyof T] = raw as T[keyof T];
      }
    }
    return next;
  }, [searchParams, defaults]);

  const setState = useCallback(
    (patch: Partial<T>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const key of Object.keys(patch)) {
            const value = patch[key];
            if (value === undefined || value === '' || value === defaults[key]) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams, defaults],
  );

  return [state, setState] as const;
}
