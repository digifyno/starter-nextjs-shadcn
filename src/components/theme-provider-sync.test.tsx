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
    _emit(newMatches: boolean) {
      listeners.forEach((fn) => fn({ matches: newMatches } as MediaQueryListEvent));
    },
  };
  return mql;
}

describe('ThemeProvider sync and integration', () => {
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

  it('cycles through themes: system → dark → light → system', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.theme).toBe('system');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => { result.current.setTheme('dark'); });
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => { result.current.setTheme('light'); });
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    act(() => { result.current.setTheme('system'); });
    expect(result.current.theme).toBe('system');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  // ── Cross-tab sync ────────────────────────────────────────────────────────

  it('updates theme when storage event fires from another tab', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(result.current.theme).toBe('system');

    act(() => {
      localStorageMock['theme'] = '"dark"';
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'theme', newValue: '"dark"' })
      );
    });

    expect(result.current.theme).toBe('dark');
  });

  it('does not throw during rendering (SSR safety guard)', () => {
    expect(() => {
      render(<ThemeProvider><div>child</div></ThemeProvider>);
    }).not.toThrow();
  });

  // ── Integration tests: ThemeToggle + ThemeProvider ────────────────────────

  it('dark mode persists across navigation (unmount and remount)', async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorageMock['theme']).toBe('"dark"');

    unmount();
    document.documentElement.classList.remove('dark');

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to system mode');
  });

  it('light mode: localStorage stores "light" and dark class is removed from html', async () => {
    const user = userEvent.setup();

    localStorageMock['theme'] = '"dark"';

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('button'));

    expect(localStorageMock['theme']).toBe('"light"');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('system preference (prefers-color-scheme: dark) is respected when no localStorage value is set', () => {
    const darkMql = makeMatchMedia(true);
    vi.stubGlobal('matchMedia', vi.fn(() => darkMql));

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');
  });

  it('ThemeToggle aria-label reflects current mode correctly through a full cycle', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to dark mode');

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to system mode');

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');
  });
});
