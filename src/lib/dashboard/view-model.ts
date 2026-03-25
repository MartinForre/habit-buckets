import type { DailyState } from "@/lib/domain"

export type DashboardBucketViewModel = {
  id: string
  name: string
  completed: boolean
  statusLabel: "Complete" | "Incomplete"
}

export type DashboardActivityViewModel = {
  id: string
  name: string
  completed: boolean
  bucketNames: string[]
}

export type DashboardViewModel = {
  dateLabel: string
  buckets: DashboardBucketViewModel[]
  activities: DashboardActivityViewModel[]
  hasActivities: boolean
}

export function createDashboardViewModel(
  state: DailyState,
  options?: { locale?: string; timeZone?: string }
): DashboardViewModel {
  const locale = options?.locale ?? "en-US"
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: options?.timeZone,
  })

  const bucketNameById = new Map(state.buckets.map((bucket) => [bucket.id, bucket.name]))

  return {
    dateLabel: formatter.format(new Date(`${state.date}T00:00:00.000Z`)),
    buckets: state.buckets.map((bucket) => ({
      id: bucket.id,
      name: bucket.name,
      completed: bucket.completed,
      statusLabel: bucket.completed ? "Complete" : "Incomplete",
    })),
    activities: state.activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      completed: activity.completed,
      bucketNames: activity.bucketIds
        .map((bucketId) => bucketNameById.get(bucketId))
        .filter((name): name is string => Boolean(name)),
    })),
    hasActivities: state.activities.length > 0,
  }
}
