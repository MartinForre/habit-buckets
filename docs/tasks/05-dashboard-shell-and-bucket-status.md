# Task 05: Dashboard Shell and Bucket Status

## Goal

Build the core dashboard UI with today's date, bucket list, and completion indicators.

## Scope

- Create mobile-first dashboard layout.
- Show today's date prominently.
- Render bucket cards with complete/incomplete states.
- Calculate and display bucket completion from today's activity logs.
- Add empty-state guidance when no activities exist.

## Acceptance Criteria

- Dashboard loads for authenticated users and displays date, buckets, and visual status.
- Bucket state follows rule: complete when at least one linked activity is completed today.
- Complete and incomplete states use clear, distinct visual cues.
- Empty state prompts user to add activities without dead ends.
- Unit tests for bucket completion calculation and dashboard view-model mapping are implemented and passing.
