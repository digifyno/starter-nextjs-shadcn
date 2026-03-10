import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initialValue when storage is empty', () => {
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
});
