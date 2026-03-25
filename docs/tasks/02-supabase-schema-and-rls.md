# Task 02: Supabase Schema and RLS

## Goal

Create the MVP database schema and secure it with row-level security.

## Scope

- Create tables: `buckets`, `activities`, `activity_buckets`, `activity_logs`.
- Add foreign keys, unique constraints, and useful indexes.
- Enable RLS and write policies so users can only access their own data.
- Seed default buckets (`Body`, `Life`, `People`) for new users.
- Add migration scripts and schema documentation.

## Acceptance Criteria

- All required tables exist with columns matching `docs/requirements.md`.
- RLS is enabled on user-owned tables and blocks cross-user access.
- New users receive default buckets automatically.
- Migrations run cleanly on a fresh database.
- Unit tests for schema-level logic helpers and policy-aware data access wrappers are implemented and passing.
