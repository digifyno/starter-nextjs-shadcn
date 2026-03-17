import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Loading from './loading';

expect.extend(toHaveNoViolations);

describe('Loading', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeTruthy();
  });

  it('has role=status for screen reader announcement', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<Loading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
