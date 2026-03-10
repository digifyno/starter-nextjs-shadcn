# Project Guide

## Stack
- **Next.js 16** (App Router, static export)
- **React 19** with TypeScript (strict)
- **Tailwind CSS v4** (CSS-first config via `@theme` in globals.css)
- **shadcn/ui** components (New York style, uses `radix-ui` unified package)
- **Lucide React** for icons

## Commands
```bash
npm run dev        # Start dev server
npm run build      # Build to dist/ (static export)
npx tsc --noEmit   # Type check
npm run lint       # Run ESLint
```

## Project Structure
```
src/
  app/
    globals.css    # Tailwind v4 @theme config + base styles
    layout.tsx     # Root layout (metadata, html/body)
    page.tsx       # Home page (/)
  components/
    ui/            # shadcn/ui components (Button, etc.)
  lib/
    utils.ts       # cn() helper (clsx + tailwind-merge)
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

### Icons
```tsx
import { ArrowRight } from 'lucide-react';
<ArrowRight className="h-4 w-4" />
```

## Static Export Limitations
This project uses `output: 'export'` for static hosting. The following are NOT available:
- Server Actions / API Routes
- Middleware
- `next/image` optimization (images are unoptimized)
- Dynamic routes without `generateStaticParams`
