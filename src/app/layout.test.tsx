import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import RootLayout from './layout';

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
});
