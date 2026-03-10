import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from './page';

expect.extend(toHaveNoViolations);

describe('Home page', () => {
  it('renders welcome heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
