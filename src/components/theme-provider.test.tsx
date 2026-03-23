import { render, renderHook, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider, useTheme } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

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
    // Helper to simulate a change event
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
    // Reset documentElement classes
    document.documentElement.classList.remove('dark');

    // Mock localStorage
    localStorageMock = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => localStorageMock[key] ?? null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key, value) => { localStorageMock[key] = value; }
    );

    // Default matchMedia: system preference is light
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

  // ── Integration tests: ThemeToggle + ThemeProvider ────────────────────────

  it('dark mode persists across navigation (unmount and remount)', async () => {
    const user = userEvent.setup();

    // Initial render with system theme (no localStorage value)
    const { unmount } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Current theme is 'system' -> clicking sets 'light'
    await user.click(screen.getByRole('button'));
    // Now theme is 'light' -> clicking sets 'dark'
    await user.click(screen.getByRole('button'));

    // Confirm dark class is applied and localStorage has 'dark'
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorageMock['theme']).toBe('dark');

    // Simulate navigation: unmount (navigate away) then remount (navigate back)
    unmount();
    document.documentElement.classList.remove('dark');

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Theme should be restored from localStorage as 'dark'
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to system mode');
  });

  it('light mode: localStorage stores "light" and dark class is removed from html', async () => {
    const user = userEvent.setup();

    // Start with dark theme in localStorage
    localStorageMock['theme'] = 'dark';

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Initially dark class should be applied
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click to advance from 'dark' -> 'system'
    await user.click(screen.getByRole('button'));
    // Click to advance from 'system' -> 'light'
    await user.click(screen.getByRole('button'));

    expect(localStorageMock['theme']).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('system preference (prefers-color-scheme: dark) is respected when no localStorage value is set', () => {
    // Override matchMedia to report dark system preference
    const darkMql = makeMatchMedia(true);
    vi.stubGlobal('matchMedia', vi.fn(() => darkMql));

    // No localStorage value set -- theme defaults to 'system'
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Dark class should be applied from system preference
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    // Theme state is still 'system' (not 'dark'), so next in cycle is 'light'
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');
  });

  it('ThemeToggle aria-label reflects current mode correctly through a full cycle', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    // Initial state: theme is 'system' -> next is 'light'
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');

    // Click: system -> light
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to dark mode');

    // Click: light -> dark
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to system mode');

    // Click: dark -> system
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');
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
