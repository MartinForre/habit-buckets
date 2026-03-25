# Habit Buckets MVP Task Checklist

Use this file as the execution tracker for all acceptance criteria.

## Task 01: Project Bootstrap

- [x] App runs locally and renders a basic shell page.
- [x] Tailwind and shadcn styles are loaded correctly.
- [x] Supabase client modules compile and can be imported from app code.
- [x] `npm run lint` and `npm run build` succeed.
- [x] Unit tests for basic app bootstrap and shared utilities are implemented and passing.

## Task 02: Supabase Schema and RLS

- [x] All required tables exist with columns matching `docs/requirements.md`.
- [x] RLS is enabled on user-owned tables and blocks cross-user access.
- [x] New users receive default buckets automatically.
- [x] Migrations run cleanly on a fresh database.
- [x] Unit tests for schema-level logic helpers and policy-aware data access wrappers are implemented and passing.

## Task 03: Authentication

- [x] Users can sign up and sign in with email/password.
- [x] Authenticated sessions persist across refresh and browser restarts.
- [x] Protected routes redirect unauthenticated users to sign-in.
- [x] Authenticated users are auto-routed to the dashboard.
- [x] Unit tests for auth guards, session utilities, and auth state transitions are implemented and passing.

## Task 04: Core Domain and Data Access

- [x] Data-access functions cover: fetch today state, toggle completion, CRUD activity, fetch history day.
- [x] Date logic consistently resolves "today" for user-facing daily reset behavior.
- [x] Invalid payloads are rejected with user-safe errors.
- [x] Service layer is reusable by routes/components without duplication.
- [x] Unit tests for domain transforms, date boundary behavior, and validation logic are implemented and passing.

## Task 05: Dashboard Shell and Bucket Status

- [ ] Dashboard loads for authenticated users and displays date, buckets, and visual status.
- [ ] Bucket state follows rule: complete when at least one linked activity is completed today.
- [ ] Complete and incomplete states use clear, distinct visual cues.
- [ ] Empty state prompts user to add activities without dead ends.
- [ ] Unit tests for bucket completion calculation and dashboard view-model mapping are implemented and passing.

## Task 06: Activity Toggle and Daily Logs

- [ ] Users can toggle activities on and off from the dashboard.
- [ ] Toggle action persists immediately and survives refresh.
- [ ] Bucket indicators update instantly when toggles change completion state.
- [ ] Completion is date-scoped; previous or next day data is not overwritten.
- [ ] Unit tests for toggle reducer/service logic and date-scoped persistence behavior are implemented and passing.

## Task 07: Activity Management CRUD

- [ ] Users can create an activity linked to one or multiple buckets.
- [ ] Users can edit activity name and bucket associations.
- [ ] Users can delete an activity and it no longer appears in dashboard/history.
- [ ] Validation prevents empty names and zero-bucket selection.
- [ ] Unit tests for create/update/delete validation and bucket-mapping rules are implemented and passing.

## Task 08: History View

- [ ] Users can view previous days from history.
- [ ] Each history day shows which buckets were complete and which activities were done.
- [ ] History view is read-only and does not mutate logs.
- [ ] Days with no activity logs show a clear empty state.
- [ ] Unit tests for history aggregation/selectors and date filtering are implemented and passing.

## Task 09: Mobile UX and Polish

- [ ] Core dashboard interactions are easy to use one-handed on mobile.
- [ ] No required action depends on tiny controls or hidden gestures.
- [ ] Empty, loading, and error states are explicit and actionable.
- [ ] Interaction latency feels immediate for toggle and CRUD actions.
- [ ] Unit tests for critical interaction-state utilities and UI state mappers are implemented and passing.

## Task 10: PWA Installability

- [ ] App is installable on supported mobile browsers.
- [ ] App icon and splash-related metadata are correctly configured.
- [ ] Installed app launches in standalone mode.
- [ ] Basic offline behavior for shell/navigation is functional (if implemented in MVP scope).
- [ ] Unit tests for manifest/config generation helpers and PWA-related utility logic are implemented and passing.

## Task 11: Deployment and Environment Configuration

- [ ] App deploys successfully to Vercel.
- [ ] Environment variables are required and validated at startup.
- [ ] Auth and data flows work in deployed environment.
- [ ] Setup documentation allows a new developer to run and deploy the app.
- [ ] Unit tests for env validation and configuration parsing utilities are implemented and passing.

## Task 12: Final Verification and MVP Release

- [ ] All MVP criteria in `docs/requirements.md` section 10 are demonstrably satisfied.
- [ ] Full test suite passes in CI and local run.
- [ ] Production build succeeds with no blocking errors.
- [ ] Release notes summarize delivered scope and deferred enhancements.
- [ ] Unit tests across authentication, domain logic, dashboard behavior, activity toggling, and history all pass.
