import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from './theme-provider';

expect.extend(toHaveNoViolations);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

// ── baseline tests ────────────────────────────────────────────────────────────

it('renders a toggle button', () => {
  render(<ThemeToggle />, { wrapper: Wrapper });
  expect(screen.getByRole('button')).toBeInTheDocument();
});

it('button has accessible name', () => {
  render(<ThemeToggle />, { wrapper: Wrapper });
  const btn = screen.getByRole('button');
  expect(btn).toHaveAccessibleName();
});

// ── accessible name in each theme state ───────────────────────────────────────

it("shows 'Switch to dark mode' aria-label when theme is light", () => {
  localStorage.setItem('theme', '"light"');
  render(<ThemeToggle />, { wrapper: Wrapper });
  expect(screen.getByRole('button')).toHaveAccessibleName('Switch to dark mode');
});

it("shows 'Switch to system mode' aria-label when theme is dark", () => {
  localStorage.setItem('theme', '"dark"');
  render(<ThemeToggle />, { wrapper: Wrapper });
  expect(screen.getByRole('button')).toHaveAccessibleName('Switch to system mode');
});

it("shows 'Switch to light mode' aria-label when theme is system", () => {
  render(<ThemeToggle />, { wrapper: Wrapper }); // default theme is 'system'
  expect(screen.getByRole('button')).toHaveAccessibleName('Switch to light mode');
});

// ── keyboard interaction tests ────────────────────────────────────────────────

it('receives focus when Tab is pressed from a preceding focusable element', async () => {
  const user = userEvent.setup();
  render(
    <ThemeProvider>
      <button>before</button>
      <ThemeToggle />
    </ThemeProvider>,
  );
  const [, toggleButton] = screen.getAllByRole('button');
  await user.tab(); // focus 'before'
  await user.tab(); // advance to ThemeToggle
  expect(toggleButton).toHaveFocus();
});

it('activates toggle when Enter is pressed while focused', async () => {
  const user = userEvent.setup();
  localStorage.setItem('theme', '"light"');
  render(<ThemeToggle />, { wrapper: Wrapper });
  const button = screen.getByRole('button');
  button.focus();
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await user.keyboard('{Enter}');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});

it('activates toggle when Space is pressed while focused', async () => {
  const user = userEvent.setup();
  localStorage.setItem('theme', '"light"');
  render(<ThemeToggle />, { wrapper: Wrapper });
  const button = screen.getByRole('button');
  button.focus();
  expect(document.documentElement.classList.contains('dark')).toBe(false);
  await user.keyboard(' ');
  expect(document.documentElement.classList.contains('dark')).toBe(true);
});

// ── focus ring / keyboard reachability ───────────────────────────────────────

it('is keyboard-reachable: tabIndex is not -1', () => {
  render(<ThemeToggle />, { wrapper: Wrapper });
  expect(screen.getByRole('button')).not.toHaveAttribute('tabindex', '-1');
});

it('does not suppress focus ring via inline outline style', () => {
  render(<ThemeToggle />, { wrapper: Wrapper });
  const button = screen.getByRole('button');
  expect(button.style.outline).not.toBe('none');
  expect(button.style.outlineStyle).not.toBe('none');
});

it('has no axe accessibility violations', async () => {
  const { container } = render(<ThemeToggle />, { wrapper: Wrapper });
  expect(await axe(container)).toHaveNoViolations();
});

describe('dark mode accessibility', () => {
  beforeEach(() => {
    document.documentElement.classList.add('dark');
  });
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('has no axe violations in dark mode', async () => {
    const { container } = render(<ThemeToggle />, { wrapper: Wrapper });
    expect(await axe(container)).toHaveNoViolations();
  });
});
