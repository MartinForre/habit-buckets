# Task 07: Activity Management CRUD

## Goal

Allow users to create, edit, and delete activities with one-or-more bucket mapping.

## Scope

- Build add-activity flow with name and bucket selection.
- Build edit-activity flow for name and bucket mappings.
- Build delete-activity flow with confirmation.
- Ensure each activity is linked to at least one bucket.
- Keep dashboard state in sync after CRUD actions.

## Acceptance Criteria

- Users can create an activity linked to one or multiple buckets.
- Users can edit activity name and bucket associations.
- Users can delete an activity and it no longer appears in dashboard/history.
- Validation prevents empty names and zero-bucket selection.
- Unit tests for create/update/delete validation and bucket-mapping rules are implemented and passing.
