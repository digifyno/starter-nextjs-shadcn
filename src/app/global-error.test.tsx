import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import GlobalError from './global-error';

it('does not render raw error.message in production', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const error = new Error('Sensitive internal stack details');
  render(<GlobalError error={error} reset={() => {}} />);
  expect(screen.queryByText('Sensitive internal stack details')).not.toBeInTheDocument();
  vi.unstubAllEnvs();
});

it('has role=alert for screen reader announcement', () => {
  render(<GlobalError error={new Error('test')} reset={() => {}} />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

it('calls reset when Try again button is clicked', () => {
  const reset = vi.fn();
  render(<GlobalError error={new Error('test')} reset={reset} />);
  fireEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(reset).toHaveBeenCalledTimes(1);
});

it('renders a generic heading instead of raw error in production', () => {
  vi.stubEnv('NODE_ENV', 'production');
  render(<GlobalError error={new Error('sensitive details')} reset={() => {}} />);
  const alert = screen.getByRole('alert');
  expect(alert).toBeInTheDocument();
  expect(screen.queryByText('sensitive details')).not.toBeInTheDocument();
  // A heading should be visible as the fallback message
  expect(screen.getByRole('heading')).toBeInTheDocument();
  vi.unstubAllEnvs();
});
