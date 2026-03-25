# Task 06: Activity Toggle and Daily Logs

## Goal

Implement instant toggle interactions that persist completion per date and update buckets immediately.

## Scope

- Render activity list with checkbox/toggle controls.
- Toggle completion on tap and persist to `activity_logs` for the active date.
- Support idempotent toggle-on/toggle-off behavior.
- Refresh affected bucket statuses immediately after toggles.
- Handle optimistic UI and rollback on failure.

## Acceptance Criteria

- Users can toggle activities on and off from the dashboard.
- Toggle action persists immediately and survives refresh.
- Bucket indicators update instantly when toggles change completion state.
- Completion is date-scoped; previous or next day data is not overwritten.
- Unit tests for toggle reducer/service logic and date-scoped persistence behavior are implemented and passing.
