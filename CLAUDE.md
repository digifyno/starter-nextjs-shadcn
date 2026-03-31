# Project Guide

## Stack
- **Next.js 16** (App Router, static export)
- **React 19** with TypeScript (strict)
- **Tailwind CSS v4** (CSS-first config via `@theme` in globals.css)
- **shadcn/ui** components (New York style, uses `radix-ui` unified package)
- **Lucide React** for icons
- **Vitest** + **@testing-library/react** for unit testing

## Commands
```bash
npm run dev        # Start dev server
npm run build      # Build to dist/ (static export)
npm run preview    # Preview static build locally (serves dist/)
npm test           # Run tests (vitest)
npm run coverage   # Run tests with coverage report (vitest --coverage)
npx tsc --noEmit   # Type check
npm run lint       # Run ESLint
```

## Project Structure
```
src/
  app/
    about/
      page.test.tsx  # About page tests (smoke + axe including dark mode)
      page.tsx     # About page (/about)
    global-error.test.tsx  # Tests for global error boundary
    global-error.tsx  # Global error boundary (sanitized error messages, role=alert, production guard)
    globals.css    # Tailwind v4 @theme config + base styles
    layout.test.tsx  # Full-layout axe accessibility test
    layout.tsx     # Root layout (metadata, html/body, ThemeProvider, ErrorBoundary, skip-to-content)
    loading.tsx    # App Router loading UI skeleton (shown during route transitions)
    loading.test.tsx  # Tests for Loading skeleton component
    manifest.ts    # PWA web app manifest (generates /manifest.webmanifest)
    manifest.test.ts  # Tests for PWA manifest output
    not-found.test.tsx  # 404 page tests
    not-found.tsx  # 404 page
    opengraph-image.test.ts  # Tests for OgImage default export and metadata exports
    opengraph-image.tsx  # OG image generation (1200×630 PNG via next/og ImageResponse)
    page.test.tsx  # Home page smoke test + axe accessibility test
    page.tsx       # Home page (/)
    robots.ts      # Generates /robots.txt
    robots.test.ts  # Tests for robots.txt output
    sitemap.ts     # Generates /sitemap.xml
    sitemap.test.ts  # Tests for sitemap output
    twitter-image.tsx  # Twitter/X card image (800×800 PNG, re-uses OG image)
    twitter-image.test.ts  # Tests for Twitter image metadata and default export
  components/
    error-boundary.tsx  # ErrorBoundary (wraps header + main; fallback uses Button)
    error-boundary.test.tsx  # Tests for ErrorBoundary component
    theme-provider.test.tsx  # Unit tests for ThemeProvider component
    theme-provider.tsx  # ThemeProvider (context + hooks; class-based DOM toggling)
    theme-toggle.test.tsx  # Unit tests for ThemeToggle component
    theme-toggle.tsx    # Dark/light mode toggle button
    ui/            # shadcn/ui components (Button, etc.)
  hooks/
    use-local-storage.test.ts  # Edge-case tests (SSR, QuotaExceededError, corrupt JSON, null/undefined values)
    use-local-storage.ts  # useLocalStorage<T>(key, initialValue) — persists state to localStorage; SSR-safe, handles storage errors and corrupt JSON silently
  lib/
    utils.test.ts  # Unit tests for cn() helper
    utils.ts       # cn() helper (clsx + tailwind-merge)
  test/
    setup.ts       # Vitest setup (@testing-library/jest-dom matchers)
public/
  icon-192x192.png  # PWA icon (192×192) — replace with production icon
  icon-512x512.png  # PWA icon (512×512) — replace with production icon
dist/              # Build output (git-ignored)
```

## Key Patterns

### Adding a Page
Create `src/app/<route>/page.tsx`. It's a Server Component by default.

### Client Components
Add `'use client'` at the top of files that use hooks (`useState`, `useEffect`, event handlers).

### Adding shadcn/ui Components
```bash
npx shadcn@latest add <component-name>

# Preview changes before applying
npx shadcn@latest add <component-name> --dry-run
npx shadcn@latest add <component-name> --diff
```

Components are added to `src/components/ui/`. They use the unified `radix-ui` package.

### Using Design System Presets
Share your entire design system (colors, fonts, radius) as a preset code:
```bash
# Apply a preset during init
npx shadcn@latest init --preset <code>

# Reinitialize with a different preset
npx shadcn@latest init --preset <code>
```
Generate and share presets at https://ui.shadcn.com/create

### Tailwind v4
No `tailwind.config.js` -- theme is configured with `@theme` blocks in `src/app/globals.css`.

### Dark Mode
Dark mode uses class-based toggling via `ThemeProvider` (wraps root layout). The toggle button is `ThemeToggle`. To add dark-mode styles use the `dark:` Tailwind variant.

### Icons
```tsx
import { ArrowRight } from 'lucide-react';
<ArrowRight className="h-4 w-4" />
```

### Writing Tests
Tests live alongside source files (e.g., `page.test.tsx`) or in `src/test/`. Use `@testing-library/react` for component tests:
```tsx
import { render, screen } from '@testing-library/react';
import Home from './page';

it('renders heading', () => {
  render(<Home />);
  expect(screen.getByRole('heading')).toBeInTheDocument();
});
```

For accessibility testing use `jest-axe`:
```tsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('has no axe violations', async () => {
  const { container } = render(<MyComponent />);
  expect(await axe(container)).toHaveNoViolations();
});
```

## Static Export Limitations
This project uses `output: 'export'` for static hosting. The following are NOT available:
- Server Actions / API Routes
- Middleware
- `next/image` optimization (images are unoptimized)
- Dynamic routes without `generateStaticParams`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | The canonical base URL of the deployed site, used in `sitemap.xml` and `robots.txt` | `https://example.com` |

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BASE_URL` to your production domain before building.
