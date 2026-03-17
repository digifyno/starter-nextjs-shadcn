import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from './theme-provider';

beforeEach(() => {
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

it('renders a toggle button', () => {
  render(<ThemeToggle />, { wrapper: Wrapper });
  expect(screen.getByRole('button')).toBeInTheDocument();
});

it('button has accessible name', () => {
  render(<ThemeToggle />, { wrapper: Wrapper });
  const btn = screen.getByRole('button');
  expect(btn).toHaveAccessibleName();
});
