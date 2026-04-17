import { render, renderHook, act } from '@testing-library/react';
import React from 'react';
import { ThemeProvider, useTheme } from './theme-provider';

function makeMatchMedia(matches: boolean) {
  const listeners: ((e: MediaQueryListEvent) => void)[] = [];
  const mql = {
    matches,
    addEventListener: vi.fn((_: string, fn: (e: MediaQueryListEvent) => void) => {
      listeners.push(fn);
    }),
    removeEventListener: vi.fn((_: string, fn: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    }),
    _emit(newMatches: boolean) {
      listeners.forEach((fn) => fn({ matches: newMatches } as MediaQueryListEvent));
    },
  };
  return mql;
}

describe('ThemeProvider', () => {
  let localStorageMock: Record<string, string>;
  let mql: ReturnType<typeof makeMatchMedia>;

  beforeEach(() => {
    document.documentElement.classList.remove('dark');

    localStorageMock = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => localStorageMock[key] ?? null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key, value) => { localStorageMock[key] = value; }
    );

    mql = makeMatchMedia(false);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('reads initial theme from localStorage (dark)', () => {
    localStorageMock['theme'] = 'dark';
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.theme).toBe('dark');
  });

  it('defaults to system when localStorage returns null', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(result.current.theme).toBe('system');
  });

  it('writes to localStorage when setTheme is called', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    act(() => {
      result.current.setTheme('light');
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('adds dark class when setTheme("dark") is called', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    act(() => {
      result.current.setTheme('dark');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when setTheme("light") is called', () => {
    document.documentElement.classList.add('dark');
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    act(() => {
      result.current.setTheme('light');
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies dark class when system preference is dark', () => {
    mql = makeMatchMedia(true);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));

    renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('does not apply dark class when system preference is light', () => {
    mql = makeMatchMedia(false);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));

    renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('applies dark class when system matchMedia fires a change event with matches: true', () => {
    mql = makeMatchMedia(false);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));

    renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => {
      mql._emit(true);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when system matchMedia fires a change event with matches: false', () => {
    mql = makeMatchMedia(true);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));

    renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      mql._emit(false);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('removes matchMedia listener when theme changes away from system', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    act(() => {
      result.current.setTheme('dark');
    });

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <span>Hello</span>
      </ThemeProvider>
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });
});

describe('useTheme', () => {
  it('returns default context values when used outside ThemeProvider', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('calling setTheme from default context does not throw', () => {
    const { result } = renderHook(() => useTheme());
    expect(() => result.current.setTheme('dark')).not.toThrow();
  });
});
