import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { vi } from 'vitest';
import RootLayout from './layout';

expect.extend(toHaveNoViolations);

vi.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => null,
}));

vi.mock('./globals.css', () => ({}));

describe('RootLayout', () => {
  it('renders skip-to-content link', () => {
    render(<RootLayout><div /></RootLayout>);
    const skip = screen.getByText(/skip to content/i);
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute('href', '#main-content');
  });

  it('full layout has no axe accessibility violations', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <RootLayout>
        <div>
          <h1>Test page</h1>
          <p>Content</p>
        </div>
      </RootLayout>
    );
    consoleError.mockRestore();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('dark mode accessibility', () => {
  beforeEach(() => {
    document.documentElement.classList.add('dark');
  });
  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('has no axe violations in dark mode', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container } = render(
      <RootLayout>
        <div>
          <h1>Test page</h1>
          <p>Content</p>
        </div>
      </RootLayout>
    );
    consoleError.mockRestore();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
