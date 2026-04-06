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

  it('renders main element with id="main-content" as skip-link target', () => {
    render(<RootLayout><div /></RootLayout>);
    expect(document.getElementById('main-content')).toBeInTheDocument();
    expect(document.getElementById('main-content')?.tagName).toBe('MAIN');
  });

  it('includes JSON-LD structured data with correct type and name', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<RootLayout><div /></RootLayout>);
    consoleError.mockRestore();
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBeGreaterThan(0);
    const data = JSON.parse(scripts[0].textContent ?? '{}');
    expect(data['@type']).toBe('WebSite');
    expect(data.name).toBe('My App');
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

it('globals.css contains prefers-reduced-motion media query', () => {
  const fs = require('fs');
  const path = require('path');
  const cssPath = path.join(process.cwd(), 'src', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');
  expect(css).toContain('prefers-reduced-motion: reduce');
});
