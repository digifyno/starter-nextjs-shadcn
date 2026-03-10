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
npx tsc --noEmit   # Type check
npm run lint       # Run ESLint
```

## Project Structure
```
src/
  app/
    about/
      page.tsx     # About page (/about)
    globals.css    # Tailwind v4 @theme config + base styles
    layout.tsx     # Root layout (metadata, html/body, ThemeProvider)
    not-found.tsx  # 404 page
    page.test.tsx  # Home page smoke test
    page.tsx       # Home page (/)
  components/
    theme-provider.tsx  # ThemeProvider (class-based dark mode)
    theme-toggle.tsx    # Dark/light mode toggle button
    ui/            # shadcn/ui components (Button, etc.)
  lib/
    utils.ts       # cn() helper (clsx + tailwind-merge)
  test/
    setup.ts       # Vitest setup (@testing-library/jest-dom matchers)
public/            # Static assets
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
```
Components are added to `src/components/ui/`. They use the unified `radix-ui` package.

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

## Static Export Limitations
This project uses `output: 'export'` for static hosting. The following are NOT available:
- Server Actions / API Routes
- Middleware
- `next/image` optimization (images are unoptimized)
- Dynamic routes without `generateStaticParams`
