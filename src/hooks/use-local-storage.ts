import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = (newValue: T) => {
    setValue(newValue);
    try { localStorage.setItem(key, JSON.stringify(newValue)); } catch {}
  };

  return [value, set] as const;
}
