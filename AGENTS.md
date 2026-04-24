# Agent Guide

## Next.js Documentation

Read bundled docs for accurate, version-matched API references — prefer these over training data:

```
node_modules/next/dist/docs/
  index.md                      # Overview and navigation
  01-app/                       # App Router (routing, layouts, Server Components, data fetching)
  02-pages/                     # Pages Router (legacy)
  03-architecture/              # Rendering, bundling, caching internals
  04-community/                 # Upgrade guides and RFCs
```

## Project Conventions

See **CLAUDE.md** for:
- Stack versions (Next.js 16, React 19, TypeScript strict, Tailwind v4, shadcn/ui)
- Dev/build/test/lint commands
- File structure and key patterns
- How to add pages, client components, and shadcn/ui components

## Static Export Constraints

This project uses `output: 'export'`. The following are **not available**:

- Server Actions
- API Routes
- Middleware
- `next/image` optimization (images are unoptimized)
- Dynamic routes without `generateStaticParams`

## Build and Deployment

- Build output goes to `dist/` — nginx serves files from there, nowhere else
- Build: `npm install && NODE_ENV=production npm run build`
- Auto-deploys when a PR is merged to `main`
- Do **not** push directly to `main` — open a PR instead
