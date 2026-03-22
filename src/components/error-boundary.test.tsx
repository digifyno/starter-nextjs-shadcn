import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './error-boundary';

// Suppress console.error output during error boundary tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <p>OK</p>;
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders default fallback with role="alert" and "Try again" button on error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('logs error via componentDidCatch', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalledWith(
      'ErrorBoundary caught:',
      expect.any(Error),
      expect.any(String)
    );
  });

  it('resets and re-renders children after clicking "Try again"', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();

    // Re-render with a non-throwing child before clicking reset
    rerender(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('renders custom fallback prop instead of default', () => {
    render(
      <ErrorBoundary fallback={<p>Custom fallback</p>}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('"Try again" button has focus-visible ring classes for keyboard accessibility', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    const button = screen.getByRole('button', { name: /try again/i });
    // The shadcn Button component includes focus-visible ring classes
    expect(button.className).toMatch(/focus-visible/);
  });

  it('moves focus into the error container when error boundary catches an error', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    const alert = screen.getByRole('alert');
    expect(document.activeElement).toBe(alert);
  });

  // --- New tests ---

  it('moves focus to content area (not body) after reset', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>
    );
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(screen.getByText('OK')).toBeInTheDocument();
    // Focus must move programmatically - not left on body
    expect(document.activeElement).not.toBe(document.body);
    // The focused element wraps the child content
    expect(document.activeElement).toContainElement(screen.getByText('OK'));
  });

  it('fires onReset callback when Enter is pressed on "Try again" button', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /try again/i });
    button.focus();
    await user.keyboard('{Enter}');

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('catches a second error after reset without infinite loops', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );

    // First error - reset
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<ErrorBoundary><Bomb shouldThrow={false} /></ErrorBoundary>);
    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(screen.getByText('OK')).toBeInTheDocument();

    // Second error
    rerender(<ErrorBoundary><Bomb shouldThrow={true} /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('fallback shows accessible "Try again" button and no raw error text', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    // Raw error message must not be leaked into the UI
    expect(screen.queryByText(/Test error/)).not.toBeInTheDocument();
    // Reset button exists with a meaningful accessible name
    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toHaveAccessibleName();
  });
});
