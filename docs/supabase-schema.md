# Supabase Schema (MVP)

This document describes the database and security model implemented in `supabase/migrations/20260325190000_mvp_schema.sql`.

## Tables

### `buckets`

- Purpose: User-defined habit buckets (defaults to Body/Life/People).
- Columns: `id`, `user_id`, `name`, `created_at`.
- Constraints:
  - `user_id` references `auth.users(id)`.
  - `(user_id, name)` unique.

### `activities`

- Purpose: Activities that can satisfy one or more buckets.
- Columns: `id`, `user_id`, `name`, `created_at`.
- Constraints:
  - `user_id` references `auth.users(id)`.
  - `(user_id, name)` unique.

### `activity_buckets`

- Purpose: Many-to-many mapping between activities and buckets.
- Columns: `id`, `activity_id`, `bucket_id`, `created_at`.
- Constraints:
  - `activity_id` references `activities(id)`.
  - `bucket_id` references `buckets(id)`.
  - `(activity_id, bucket_id)` unique.
  - Trigger enforces activity and bucket must belong to the same user.

### `activity_logs`

- Purpose: Daily completion state per activity.
- Columns: `id`, `user_id`, `activity_id`, `date`, `completed`, `created_at`.
- Constraints:
  - `user_id` references `auth.users(id)`.
  - `activity_id` references `activities(id)`.
  - `(user_id, activity_id, date)` unique.

## RLS Policies

RLS is enabled for all four tables.

- `buckets`, `activities`, `activity_logs`: `auth.uid() = user_id` for `using` and `with check`.
- `activity_buckets`: access allowed only when both linked records (`activities`, `buckets`) belong to `auth.uid()`.

## Default Bucket Seeding

On new `auth.users` insert, trigger `on_auth_user_created_seed_default_buckets` runs function `seed_default_buckets_for_new_user` and inserts:

- Body
- Life
- People

## Indexing

Indexes are included for user/date access patterns and common joins:

- User-scoped created-time indexes for buckets/activities.
- Join indexes on `activity_buckets(activity_id)` and `activity_buckets(bucket_id)`.
- User/date and activity/date indexes on `activity_logs`.
- Partial index for completed logs by user/date.
