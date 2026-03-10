import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from './theme-provider';
import { ThemeToggle } from './theme-toggle';

// jsdom doesn't implement matchMedia; provide a stub
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  localStorage.clear();
});

function setup() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  it('renders a button with accessible label', () => {
    setup();
    expect(screen.getByRole('button', { name: /mode/i })).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();
    setup();
    const btn = screen.getByRole('button', { name: /mode/i });
    await user.click(btn);
    expect(btn).toHaveAccessibleName(/.+ mode/i);
  });
});
