import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GlobalError from './global-error';

describe('GlobalError page', () => {
  it('renders error heading', () => {
    render(<GlobalError error={new Error('test')} reset={() => {}} />);
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
  });

  it('renders the error message', () => {
    render(<GlobalError error={new Error('test error')} reset={() => {}} />);
    expect(screen.getByText('test error')).toBeInTheDocument();
  });

  it('shows fallback text when error message is empty', () => {
    render(<GlobalError error={new Error('')} reset={() => {}} />);
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  it('renders a Try again button', () => {
    render(<GlobalError error={new Error('test')} reset={() => {}} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls reset when Try again is clicked', async () => {
    const reset = vi.fn();
    render(<GlobalError error={new Error('test')} reset={reset} />);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
