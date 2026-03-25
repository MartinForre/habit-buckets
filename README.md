Habit Buckets is a [Next.js](https://nextjs.org) App Router project for a minimal bucket-based daily habit tracker.

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Copy env file and add Supabase values:

```bash
cp .env.example .env.local
```

3) Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

- `npm run dev` - Start vinext (Vite) dev server
- `npm run build` - Build with vinext
- `npm run start` - Start vinext production server
- `npm run dev:next` - Start Next.js dev server (fallback/compat)
- `npm run build:next` - Build with Next.js (fallback/compat)
- `npm run start:next` - Start Next.js production server (fallback/compat)
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests once
- `npm run test:watch` - Run unit tests in watch mode

## Tech Base

- vinext + Vite (Next.js-compatible runtime)
- Next.js 16 dependency retained for compatibility during migration
- Tailwind CSS v4
- shadcn/ui baseline components
- Supabase client setup (server + browser)
- Vitest + Testing Library for unit tests

For framework docs, see [Next.js documentation](https://nextjs.org/docs).

Deployment and environment setup guide: `docs/deployment-and-env.md`.
