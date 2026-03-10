import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home page', () => {
  it('renders welcome heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: /welcome/i })).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });
});
