# Task 04: Core Domain and Data Access

## Goal

Define the core domain model and data-access layer used by dashboard, toggles, and history.

## Scope

- Define TypeScript domain types for buckets, activities, and daily logs.
- Create repository/service layer functions for reading and mutating data.
- Implement date handling strategy for daily completion boundaries.
- Add input validation for activity create/update payloads.

## Acceptance Criteria

- Data-access functions cover: fetch today state, toggle completion, CRUD activity, fetch history day.
- Date logic consistently resolves "today" for user-facing daily reset behavior.
- Invalid payloads are rejected with user-safe errors.
- Service layer is reusable by routes/components without duplication.
- Unit tests for domain transforms, date boundary behavior, and validation logic are implemented and passing.
