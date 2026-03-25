# Deployment and Environment Setup

## Required Environment Variables

Set these values in local `.env` / `.env.local` and in Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The app validates these values at startup. Missing values or non-HTTPS Supabase URL will fail fast.

## Local Setup

1. Copy the template:

```bash
cp .env.example .env.local
```

2. Fill both Supabase values.
3. Run app:

```bash
npm run dev
```

## Vercel Deployment

This repository includes `vercel.json` configured to use Next.js fallback build scripts:

- `buildCommand`: `npm run build:next`
- `devCommand`: `npm run dev:next`

Deployment steps:

1. Import project in Vercel.
2. Add required environment variables in Project Settings.
3. Trigger a deployment.
4. Verify auth and dashboard/history routes in deployed URL.

## Verification Checklist

- `npm run test` passes
- `npm run lint` passes
- `npm run build` passes
- `npm run build:next` passes (matches Vercel build path)
