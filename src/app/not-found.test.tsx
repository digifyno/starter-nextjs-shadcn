import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound page', () => {
  it('renders 404 message', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('has a link back to home', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
  });
});
