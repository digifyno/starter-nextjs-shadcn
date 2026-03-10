# Next.js + React + shadcn/ui Starter

A modern web app starter built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

Outputs static files to `dist/`.

## Preview Production Build

```bash
npm run build
npm run preview
```

Open [http://localhost:3000](http://localhost:3000) to preview the static output.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_*` variables are exposed to the browser. All other variables remain server-side only.
