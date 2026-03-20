import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AboutPage from './page';

expect.extend(toHaveNoViolations);

describe('About page', () => {
  it('renders without crashing', () => {
    render(<AboutPage />);
  });

  it('contains main heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About');
  });

  it('provides navigation back to home', () => {
    render(<AboutPage />);
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<AboutPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
