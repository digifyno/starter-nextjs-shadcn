import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from './page';

expect.extend(toHaveNoViolations);

describe('Home page', () => {
  it('renders welcome heading', { tags: ['unit'] }, () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });

  it('renders Learn More link with accessible label for new tab', () => {
    render(<Home />);
    expect(
      screen.getByRole('link', { name: 'Learn More (opens in a new tab)' })
    ).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<Home />);
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
    const { container } = render(<Home />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
