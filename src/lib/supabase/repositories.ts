import type { SupabaseClient } from "@supabase/supabase-js"

import { normalizeBucketName } from "@/lib/supabase/schema"
import { unwrapDbResult } from "@/lib/supabase/errors"

export type BucketRecord = {
  id: string
  name: string
  created_at: string
}

export type ActivityRecord = {
  id: string
  name: string
  created_at: string
}

export type ActivityWithBucketsRecord = ActivityRecord & {
  bucket_ids: string[]
}

export type ActivityLogRecord = {
  id: string
  activity_id: string
  date: string
  completed: boolean
  created_at: string
}

type ActivityWithBucketsResponse = {
  id: string
  name: string
  created_at: string
  activity_buckets: Array<{ bucket_id: string }>
}

async function requireUserId(client: SupabaseClient): Promise<string> {
  const {
    data: { session },
  } = await client.auth.getSession()

  if (session?.user?.id) {
    return session.user.id
  }

  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error || !user) {
    throw new Error("Failed to resolve authenticated user")
  }

  return user.id
}

export async function ensureDefaultBuckets(client: SupabaseClient): Promise<void> {
  const result = await client.rpc("ensure_default_buckets_for_current_user")

  if (result.error) {
    unwrapDbResult(result, "Failed to ensure default buckets")
  }
}

export async function listBuckets(client: SupabaseClient): Promise<BucketRecord[]> {
  const result = await client
    .from("buckets")
    .select("id, name, created_at")
    .order("created_at", { ascending: true })

  if (result.error) {
    unwrapDbResult(result, "Failed to fetch buckets")
  }

  return (result.data ?? []) as BucketRecord[]
}

export async function createBucket(client: SupabaseClient, name: string): Promise<BucketRecord> {
  const normalizedName = normalizeBucketName(name)
  const userId = await requireUserId(client)

  const result = await client
    .from("buckets")
    .insert({ name: normalizedName, user_id: userId })
    .select("id, name, created_at")
    .single()

  return unwrapDbResult(result, "Failed to create bucket")
}

export async function listActivities(client: SupabaseClient): Promise<ActivityRecord[]> {
  const result = await client
    .from("activities")
    .select("id, name, created_at")
    .order("created_at", { ascending: true })

  if (result.error) {
    unwrapDbResult(result, "Failed to fetch activities")
  }

  return (result.data ?? []) as ActivityRecord[]
}

export async function createActivityWithBuckets(
  client: SupabaseClient,
  name: string,
  bucketIds: string[]
): Promise<ActivityRecord> {
  const userId = await requireUserId(client)

  const activity = unwrapDbResult<ActivityRecord>(
    await client
      .from("activities")
      .insert({ name: normalizeBucketName(name), user_id: userId })
      .select("id, name, created_at")
      .single(),
    "Failed to create activity"
  )

  const links = bucketIds.map((bucketId) => ({
    activity_id: activity.id,
    bucket_id: bucketId,
  }))

  unwrapDbResult(
    await client.from("activity_buckets").insert(links).select("id"),
    "Failed to map activity to buckets"
  )

  return activity
}

export async function listActivitiesWithBucketIds(
  client: SupabaseClient
): Promise<ActivityWithBucketsRecord[]> {
  const result = await client
    .from("activities")
    .select("id, name, created_at, activity_buckets(bucket_id)")
    .order("created_at", { ascending: true })

  if (result.error) {
    unwrapDbResult(result, "Failed to fetch activities with buckets")
  }

  const rows = (result.data ?? []) as ActivityWithBucketsResponse[]

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    created_at: row.created_at,
    bucket_ids: row.activity_buckets.map((item) => item.bucket_id),
  }))
}

export async function listActivityLogsForDate(
  client: SupabaseClient,
  date: string
): Promise<ActivityLogRecord[]> {
  const result = await client
    .from("activity_logs")
    .select("id, activity_id, date, completed, created_at")
    .eq("date", date)
    .order("created_at", { ascending: true })

  if (result.error) {
    unwrapDbResult(result, "Failed to fetch activity logs")
  }

  return (result.data ?? []) as ActivityLogRecord[]
}

export async function listActivityLogDates(
  client: SupabaseClient,
  limit = 30
): Promise<string[]> {
  const result = await client
    .from("activity_logs")
    .select("date")
    .order("date", { ascending: false })
    .limit(limit)

  if (result.error) {
    unwrapDbResult(result, "Failed to fetch activity log dates")
  }

  const rows = (result.data ?? []) as Array<{ date: string }>
  return Array.from(new Set(rows.map((row) => row.date)))
}

export async function upsertActivityLog(
  client: SupabaseClient,
  input: {
    activityId: string
    date: string
    completed: boolean
  }
): Promise<ActivityLogRecord> {
  const userId = await requireUserId(client)

  const result = await client
    .from("activity_logs")
    .upsert(
      {
        user_id: userId,
        activity_id: input.activityId,
        date: input.date,
        completed: input.completed,
      },
      {
        onConflict: "user_id,activity_id,date",
      }
    )
    .select("id, activity_id, date, completed, created_at")
    .single()

  return unwrapDbResult<ActivityLogRecord>(result, "Failed to upsert activity log")
}

export async function getActivityLogForDate(
  client: SupabaseClient,
  activityId: string,
  date: string
): Promise<ActivityLogRecord | null> {
  const result = await client
    .from("activity_logs")
    .select("id, activity_id, date, completed, created_at")
    .eq("activity_id", activityId)
    .eq("date", date)
    .maybeSingle()

  if (result.error) {
    unwrapDbResult(result, "Failed to fetch activity log")
  }

  return (result.data ?? null) as ActivityLogRecord | null
}

export async function updateActivityWithBuckets(
  client: SupabaseClient,
  activityId: string,
  input: {
    name: string
    bucketIds: string[]
  }
): Promise<ActivityRecord> {
  const updatedActivity = unwrapDbResult<ActivityRecord>(
    await client
      .from("activities")
      .update({ name: normalizeBucketName(input.name) })
      .eq("id", activityId)
      .select("id, name, created_at")
      .single(),
    "Failed to update activity"
  )

  unwrapDbResult(
    await client.from("activity_buckets").delete().eq("activity_id", activityId).select("id"),
    "Failed to reset activity bucket mappings"
  )

  const links = input.bucketIds.map((bucketId) => ({
    activity_id: activityId,
    bucket_id: bucketId,
  }))

  unwrapDbResult(
    await client.from("activity_buckets").insert(links).select("id"),
    "Failed to update activity bucket mappings"
  )

  return updatedActivity
}

export async function deleteActivityById(client: SupabaseClient, activityId: string): Promise<void> {
  const result = await client.from("activities").delete().eq("id", activityId).select("id")

  if (result.error) {
    unwrapDbResult(result, "Failed to delete activity")
  }
}
