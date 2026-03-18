import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GlobalError from './global-error';

describe('GlobalError page', () => {
  it('renders error heading', () => {
    render(<GlobalError error={new Error('test')} reset={() => {}} />);
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
  });

  it('does not render raw error.message in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    render(<GlobalError error={new Error('secret internal error')} reset={() => {}} />);
    expect(screen.queryByText('secret internal error')).not.toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('shows the real error message in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    render(<GlobalError error={new Error('debug error details')} reset={() => {}} />);
    expect(screen.getByText('debug error details')).toBeInTheDocument();
    vi.unstubAllEnvs();
  });

  it('shows fallback text when error message is empty in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    render(<GlobalError error={new Error('')} reset={() => {}} />);
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    vi.unstubAllEnvs();
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

  it('has role=alert on the body for screen reader announcement', () => {
    render(<GlobalError error={new Error('test')} reset={() => {}} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
