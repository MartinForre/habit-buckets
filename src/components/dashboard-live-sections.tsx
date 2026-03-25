"use client"

import { useMemo, useState } from "react"

import { createHabitServiceFromClient, type DailyState } from "@/lib/domain"
import { getActivityToggleTone, getBucketTone } from "@/lib/dashboard/interaction-state"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type DashboardLiveSectionsProps = {
  initialState: DailyState
}

function recomputeBuckets(state: DailyState): DailyState {
  const completedByBucket = new Set<string>()

  for (const activity of state.activities) {
    if (!activity.completed) {
      continue
    }

    activity.bucketIds.forEach((bucketId) => completedByBucket.add(bucketId))
  }

  return {
    ...state,
    buckets: state.buckets.map((bucket) => ({
      ...bucket,
      completed: completedByBucket.has(bucket.id),
    })),
  }
}

export function DashboardLiveSections({ initialState }: DashboardLiveSectionsProps) {
  const [state, setState] = useState<DailyState>(initialState)
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string>("")

  const service = useMemo(
    () => createHabitServiceFromClient(createSupabaseBrowserClient()),
    []
  )

  const bucketNameById = useMemo(
    () => new Map(state.buckets.map((bucket) => [bucket.id, bucket.name])),
    [state.buckets]
  )

  const hasActivities = state.activities.length > 0

  async function handleToggle(activityId: string) {
    if (pendingIds.has(activityId)) {
      return
    }

    setError("")

    let previousState: DailyState | null = null

    setState((current) => {
      previousState = current
      const next = {
        ...current,
        activities: current.activities.map((activity) =>
          activity.id === activityId ? { ...activity, completed: !activity.completed } : activity
        ),
      }

      return recomputeBuckets(next)
    })

    setPendingIds((current) => new Set(current).add(activityId))

    try {
      const result = await service.toggleActivityCompletion(activityId, {
        date: state.date,
      })

      setState((current) => {
        const next = {
          ...current,
          activities: current.activities.map((activity) =>
            activity.id === activityId ? { ...activity, completed: result.completed } : activity
          ),
        }

        return recomputeBuckets(next)
      })
    } catch {
      if (previousState) {
        setState(previousState)
      }

      setError("Could not update activity. Please try again.")
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(activityId)
        return next
      })
    }
  }

  return (
    <>
      <section className="surface-card space-y-3 p-4 text-card-foreground">
        <h2 className="text-sm font-medium text-muted-foreground">Today&apos;s buckets</h2>
        <ul className="space-y-2">
          {state.buckets.map((bucket) => {
            const tone = getBucketTone(bucket.completed)

            return (
              <li
                key={bucket.id}
                className={`touch-target flex items-center justify-between rounded-xl border px-3 py-2 ${tone.containerClass}`}
              >
                <span className="font-medium">{bucket.name}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tone.badgeClass}`}>
                  {tone.label}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="surface-card mt-1 space-y-3 p-4 text-card-foreground">
        <h2 className="text-sm font-medium text-muted-foreground">Tap to toggle</h2>

        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        {hasActivities ? (
          <ul className="space-y-2">
            {state.activities.map((activity) => {
              const toggleTone = getActivityToggleTone(activity.completed)
              const bucketNames = activity.bucketIds
                .map((bucketId) => bucketNameById.get(bucketId))
                .filter((name): name is string => Boolean(name))

              return (
                <li key={activity.id} className="rounded-xl border border-border/90 bg-white/70 px-3 py-2">
                  <button
                    type="button"
                    disabled={pendingIds.has(activity.id)}
                    onClick={() => handleToggle(activity.id)}
                    className="touch-target flex w-full items-center justify-between gap-2 rounded-md text-left disabled:opacity-60"
                  >
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {bucketNames.join(", ") || "No buckets"}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${toggleTone.badgeClass}`}>
                      {pendingIds.has(activity.id) ? "Saving..." : toggleTone.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            No activities yet. Go to Manage to add your first activity.
          </div>
        )}
      </section>
    </>
  )
}
