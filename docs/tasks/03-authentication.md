# Task 03: Authentication

## Goal

Implement email/password authentication with persistent sessions and auto-login.

## Scope

- Build sign-up and sign-in flows using Supabase Auth.
- Implement session persistence and route protection.
- Add sign-out behavior and auth-aware layout redirects.
- Handle loading and error states with minimal friction.

## Acceptance Criteria

- Users can sign up and sign in with email/password.
- Authenticated sessions persist across refresh and browser restarts.
- Protected routes redirect unauthenticated users to sign-in.
- Authenticated users are auto-routed to the dashboard.
- Unit tests for auth guards, session utilities, and auth state transitions are implemented and passing.
