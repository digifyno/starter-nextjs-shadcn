import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Loading from './loading';

expect.extend(toHaveNoViolations);

describe('Loading component', () => {
  it('renders without crashing', () => {
    render(<Loading />);
  });

  it('has a status role for screen readers', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays loading text', () => {
    render(<Loading />);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  it('includes an accessible label on the status container', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading page content');
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<Loading />);
    expect(await axe(container)).toHaveNoViolations();
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
    const { container } = render(<Loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
