import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, afterEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
import GlobalError from './global-error';

it('does not render raw error.message in production', () => {
  vi.stubEnv('NODE_ENV', 'production');
  const error = new Error('Sensitive internal stack details');
  render(<GlobalError error={error} unstable_retry={() => {}} />);
  expect(screen.queryByText('Sensitive internal stack details')).not.toBeInTheDocument();
  vi.unstubAllEnvs();
});

it('has role=alert for screen reader announcement', () => {
  render(<GlobalError error={new Error('test')} unstable_retry={() => {}} />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

it('calls unstable_retry when Try again button is clicked', () => {
  const unstable_retry = vi.fn();
  render(<GlobalError error={new Error('test')} unstable_retry={unstable_retry} />);
  fireEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(unstable_retry).toHaveBeenCalledTimes(1);
});

it('renders a generic heading instead of raw error in production', () => {
  vi.stubEnv('NODE_ENV', 'production');
  render(<GlobalError error={new Error('sensitive details')} unstable_retry={() => {}} />);
  const alert = screen.getByRole('alert');
  expect(alert).toBeInTheDocument();
  expect(screen.queryByText('sensitive details')).not.toBeInTheDocument();
  // A heading should be visible as the fallback message
  expect(screen.getByRole('heading')).toBeInTheDocument();
  vi.unstubAllEnvs();
});

it('button does not have inline outline:none style', () => {
  render(<GlobalError error={new Error('test')} unstable_retry={() => {}} />);
  const button = screen.getByRole('button', { name: /try again/i });
  expect(button.style.outline).not.toBe('none');
});

it('has no axe accessibility violations in light mode', async () => {
  const { container } = render(<GlobalError error={new Error('test')} unstable_retry={() => {}} />);
  expect(await axe(container)).toHaveNoViolations();
});

it('calls unstable_retry when Enter is pressed on Try again button', async () => {
  const user = userEvent.setup();
  const unstable_retry = vi.fn();
  render(<GlobalError error={new Error('test')} unstable_retry={unstable_retry} />);
  const button = screen.getByRole('button', { name: /try again/i });
  button.focus();
  await user.keyboard('{Enter}');
  expect(unstable_retry).toHaveBeenCalledTimes(1);
});

it('renders error.digest as an Error ID when present', () => {
  const error = Object.assign(new Error('test'), { digest: 'abc-123' });
  render(<GlobalError error={error} unstable_retry={() => {}} />);
  expect(screen.getByText(/Error ID/i)).toBeInTheDocument();
  expect(screen.getByText(/abc-123/)).toBeInTheDocument();
});

it('shows raw error.message in development mode', () => {
  vi.stubEnv('NODE_ENV', 'development');
  const error = new Error('Dev-only details');
  render(<GlobalError error={error} unstable_retry={() => {}} />);
  expect(screen.getByText('Dev-only details')).toBeInTheDocument();
  vi.unstubAllEnvs();
});

describe('dark mode accessibility', () => {
  beforeEach(() => { document.documentElement.classList.add('dark'); });
  afterEach(() => { document.documentElement.classList.remove('dark'); });

  it('has no axe violations in dark mode', async () => {
    const { container } = render(<GlobalError error={new Error('test')} unstable_retry={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
