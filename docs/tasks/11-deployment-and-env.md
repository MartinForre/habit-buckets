# Task 11: Deployment and Environment Configuration

## Goal

Prepare secure deployment to Vercel with Supabase environment configuration.

## Scope

- Configure required env vars: Supabase URL and anon key.
- Add runtime validation for missing env vars.
- Configure Vercel project settings and deployment workflow.
- Document local and production setup steps.

## Acceptance Criteria

- App deploys successfully to Vercel.
- Environment variables are required and validated at startup.
- Auth and data flows work in deployed environment.
- Setup documentation allows a new developer to run and deploy the app.
- Unit tests for env validation and configuration parsing utilities are implemented and passing.
