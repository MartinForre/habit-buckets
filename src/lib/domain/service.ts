import type { SupabaseClient } from "@supabase/supabase-js"

import { assertDateKey, getTodayDateKey } from "@/lib/domain/date"
import type { ActivityPayload, DailyState } from "@/lib/domain/types"
import { validateActivityPayload } from "@/lib/domain/validation"
import {
  createActivityWithBuckets,
  deleteActivityById,
  ensureDefaultBuckets,
  getActivityLogForDate,
  listActivitiesWithBucketIds,
  listActivityLogDates,
  listActivityLogsForDate,
  listBuckets,
  updateActivityWithBuckets,
  upsertActivityLog,
} from "@/lib/supabase/repositories"

type HabitRepository = {
  ensureDefaultBuckets: () => Promise<void>
  listBuckets: () => Promise<Array<{ id: string; name: string }>>
  listActivitiesWithBucketIds: () => Promise<Array<{ id: string; name: string; bucket_ids: string[] }>>
  listActivityLogDates: (limit?: number) => Promise<string[]>
  listActivityLogsForDate: (date: string) => Promise<Array<{ activity_id: string; completed: boolean }>>
  getActivityLogForDate: (
    activityId: string,
    date: string
  ) => Promise<{ completed: boolean } | null>
  upsertActivityLog: (input: {
    activityId: string
    date: string
    completed: boolean
  }) => Promise<{ activity_id: string; completed: boolean }>
  createActivityWithBuckets: (
    name: string,
    bucketIds: string[]
  ) => Promise<{ id: string; name: string }>
  updateActivityWithBuckets: (
    activityId: string,
    input: {
      name: string
      bucketIds: string[]
    }
  ) => Promise<{ id: string; name: string }>
  deleteActivityById: (activityId: string) => Promise<void>
}

function mapDailyState(
  date: string,
  buckets: Array<{ id: string; name: string }>,
  activities: Array<{ id: string; name: string; bucket_ids: string[] }>,
  completedActivityIds: Set<string>
): DailyState {
  const completedByBucket = new Set<string>()

  for (const activity of activities) {
    if (!completedActivityIds.has(activity.id)) {
      continue
    }

    activity.bucket_ids.forEach((bucketId) => completedByBucket.add(bucketId))
  }

  return {
    date,
    buckets: buckets.map((bucket) => ({
      id: bucket.id,
      name: bucket.name,
      completed: completedByBucket.has(bucket.id),
    })),
    activities: activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      bucketIds: activity.bucket_ids,
      completed: completedActivityIds.has(activity.id),
    })),
  }
}

export function createHabitService(repository: HabitRepository) {
  return {
    async fetchDayState(date: string): Promise<DailyState> {
      const day = assertDateKey(date)

      await repository.ensureDefaultBuckets()

      const [buckets, activities, logs] = await Promise.all([
        repository.listBuckets(),
        repository.listActivitiesWithBucketIds(),
        repository.listActivityLogsForDate(day),
      ])

      const completedActivityIds = new Set(
        logs.filter((log) => log.completed).map((log) => log.activity_id)
      )

      return mapDailyState(day, buckets, activities, completedActivityIds)
    },

    async fetchTodayState(timeZone?: string): Promise<DailyState> {
      const today = getTodayDateKey(timeZone)
      return this.fetchDayState(today)
    },

    async toggleActivityCompletion(
      activityId: string,
      options?: {
        date?: string
        timeZone?: string
      }
    ): Promise<{ activityId: string; date: string; completed: boolean }> {
      const date = options?.date ? assertDateKey(options.date) : getTodayDateKey(options?.timeZone)
      const current = await repository.getActivityLogForDate(activityId, date)
      const nextCompleted = current ? !current.completed : true

      const updated = await repository.upsertActivityLog({
        activityId,
        date,
        completed: nextCompleted,
      })

      return {
        activityId: updated.activity_id,
        date,
        completed: updated.completed,
      }
    },

    async createActivity(payload: ActivityPayload): Promise<{ id: string; name: string }> {
      const validated = validateActivityPayload(payload)
      return repository.createActivityWithBuckets(validated.name, validated.bucketIds)
    },

    async updateActivity(
      activityId: string,
      payload: ActivityPayload
    ): Promise<{ id: string; name: string }> {
      const validated = validateActivityPayload(payload)
      return repository.updateActivityWithBuckets(activityId, validated)
    },

    async deleteActivity(activityId: string): Promise<void> {
      await repository.deleteActivityById(activityId)
    },

    async fetchHistoryDay(date: string): Promise<DailyState> {
      return this.fetchDayState(date)
    },

    async listRecentHistoryDates(limit = 14): Promise<string[]> {
      return repository.listActivityLogDates(limit)
    },
  }
}

export function createHabitServiceFromClient(client: SupabaseClient) {
  return createHabitService({
    ensureDefaultBuckets: () => ensureDefaultBuckets(client),
    listBuckets: () => listBuckets(client),
    listActivitiesWithBucketIds: () => listActivitiesWithBucketIds(client),
    listActivityLogDates: (limit) => listActivityLogDates(client, limit),
    listActivityLogsForDate: (date) => listActivityLogsForDate(client, date),
    getActivityLogForDate: (activityId, date) => getActivityLogForDate(client, activityId, date),
    upsertActivityLog: (input) => upsertActivityLog(client, input),
    createActivityWithBuckets: (name, bucketIds) => createActivityWithBuckets(client, name, bucketIds),
    updateActivityWithBuckets: (activityId, input) => updateActivityWithBuckets(client, activityId, input),
    deleteActivityById: (activityId) => deleteActivityById(client, activityId),
  })
}
