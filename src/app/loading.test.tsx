import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Loading from './loading';

expect.extend(toHaveNoViolations);

describe('Loading', () => {
  it('renders a status element for screen readers', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders visible loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<Loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
