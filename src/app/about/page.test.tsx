import { render, screen } from '@testing-library/react';
import About from './page';

describe('About page', () => {
  it('renders about heading', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
  });

  it('has a link back to home', () => {
    render(<About />);
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/');
  });
});
