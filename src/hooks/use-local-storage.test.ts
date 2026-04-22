import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('returns initialValue when storage is empty', { tags: ['unit'] }, () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ''));
    act(() => {
      result.current[1]('hello');
    });
    expect(result.current[0]).toBe('hello');
    expect(localStorage.getItem('test-key')).toBe('"hello"');
  });

  it('reads existing value from localStorage on mount', () => {
    localStorage.setItem('test-key', JSON.stringify(42));
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    expect(result.current[0]).toBe(42);
  });

  it('works with object values', () => {
    const { result } = renderHook(() => useLocalStorage<{ count: number }>('obj-key', { count: 0 }));
    act(() => {
      result.current[1]({ count: 5 });
    });
    expect(result.current[0]).toEqual({ count: 5 });
  });

  describe('edge cases', () => {
    it('falls back to initialValue when localStorage.getItem throws (private browsing / quota exceeded)', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError: localStorage is not available');
      });
      const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));
      expect(result.current[0]).toBe('fallback');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('does not throw when localStorage.setItem throws (storage full)', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError');
      });
      const { result } = renderHook(() => useLocalStorage('test-key', 0));
      expect(() => {
        act(() => {
          result.current[1](99);
        });
      }).not.toThrow();
      // When persist fails the value stays at initialValue (no storage event fired)
      expect(result.current[0]).toBe(0);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('returns initialValue when localStorage is unavailable (SSR-like scenario)', () => {
      // Simulate localStorage being absent (as in SSR/Node environments where
      // window.localStorage may not exist). We stub it to undefined so the
      // hook's try/catch catches the resulting TypeError.
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const original = globalThis.localStorage;
      vi.stubGlobal('localStorage', undefined);
      try {
        const { result } = renderHook(() => useLocalStorage('ssr-key', 'ssr-default'));
        expect(result.current[0]).toBe('ssr-default');
        expect(consoleSpy).not.toHaveBeenCalled();
      } finally {
        vi.stubGlobal('localStorage', original);
      }
    });

    it('two instances with the same key read consistent values', () => {
      localStorage.setItem('shared-key', JSON.stringify('shared'));
      const { result: r1 } = renderHook(() => useLocalStorage('shared-key', 'default-a'));
      const { result: r2 } = renderHook(() => useLocalStorage('shared-key', 'default-b'));
      expect(r1.current[0]).toBe('shared');
      expect(r2.current[0]).toBe('shared');
    });

    it('second instance with the same key reads value written by first instance', () => {
      const { result: r1 } = renderHook(() => useLocalStorage('sync-key', 'init'));
      act(() => {
        r1.current[1]('updated');
      });
      // A second instance mounted after the write should pick up the persisted value
      const { result: r2 } = renderHook(() => useLocalStorage('sync-key', 'init'));
      expect(r2.current[0]).toBe('updated');
    });

    it('falls back to initialValue when stored JSON is corrupted', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('corrupt-key', '{invalid json}');
      const { result } = renderHook(() => useLocalStorage('corrupt-key', 'safe-default'));
      expect(result.current[0]).toBe('safe-default');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('handles null initialValue without throwing', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage<string | null>('null-key', null));
      expect(result.current[0]).toBeNull();
      act(() => {
        result.current[1]('now-set');
      });
      expect(result.current[0]).toBe('now-set');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('handles undefined initialValue without throwing', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useLocalStorage<string | undefined>('undef-key', undefined));
      expect(result.current[0]).toBeUndefined();
      act(() => {
        result.current[1]('defined-now');
      });
      expect(result.current[0]).toBe('defined-now');
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('two instances with the same key stay in sync when one writes', () => {
      const { result: r1 } = renderHook(() => useLocalStorage('sync-live', 'init'));
      const { result: r2 } = renderHook(() => useLocalStorage('sync-live', 'init'));
      act(() => { r1.current[1]('updated'); });
      expect(r1.current[0]).toBe('updated');
      expect(r2.current[0]).toBe('updated');
    });

    it('updates when a storage event fires from another tab', () => {
      const { result } = renderHook(() => useLocalStorage('tab-sync', 'old'));
      act(() => {
        localStorage.setItem('tab-sync', JSON.stringify('from-other-tab'));
        window.dispatchEvent(new StorageEvent('storage', { key: 'tab-sync', newValue: JSON.stringify('from-other-tab') }));
      });
      expect(result.current[0]).toBe('from-other-tab');
    });
  });
});
