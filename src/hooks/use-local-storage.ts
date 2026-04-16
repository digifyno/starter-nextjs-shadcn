import { useCallback, useRef, useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Stabilize initialValue so it doesn't create new object references each render.
  const initialValueRef = useRef(initialValue);

  // Cache the last raw string and parsed result so getSnapshot returns a stable
  // reference when the underlying storage value hasn't changed. useSyncExternalStore
  // uses Object.is to compare snapshots, so returning a new object on every call
  // (e.g. from JSON.parse) would trigger an infinite re-render loop.
  const lastRawRef = useRef<string | null | undefined>(undefined);
  const lastParsedRef = useRef<T>(initialValueRef.current);

  const getSnapshot = useCallback((): T => {
    if (typeof window === 'undefined') return initialValueRef.current;
    try {
      const raw = localStorage.getItem(key);
      if (raw === lastRawRef.current) {
        return lastParsedRef.current;
      }
      const parsed = raw !== null ? (JSON.parse(raw) as T) : initialValueRef.current;
      lastRawRef.current = raw;
      lastParsedRef.current = parsed;
      return parsed;
    } catch {
      return initialValueRef.current;
    }
  }, [key]);

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialValueRef.current,
  );

  const set = useCallback(
    (newValue: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
        // The native storage event fires only in *other* tabs;
        // dispatch manually so same-tab subscribers also update.
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: JSON.stringify(newValue),
          }),
        );
      } catch {}
    },
    [key],
  );

  return [value, set] as const;
}
