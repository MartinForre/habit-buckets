import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FormSubmitButton } from "@/components/form-submit-button"
import { signOutAction } from "@/app/auth/actions"
import {
  createActivityAction,
  deleteActivityAction,
  toggleActivityAction,
  updateActivityAction,
} from "@/app/dashboard/actions"
import { createHabitServiceFromClient } from "@/lib/domain"
import { getActivityToggleTone, getBucketTone } from "@/lib/dashboard/interaction-state"
import { createDashboardViewModel } from "@/lib/dashboard/view-model"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type DashboardPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const habitService = createHabitServiceFromClient(supabase)
  const todayState = await habitService.fetchTodayState()
  const dashboard = createDashboardViewModel(todayState)

  return (
    <main className="app-shell flex min-h-screen flex-col gap-4">
      <header className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{dashboard.dateLabel}</p>
          <h1 className="mt-1 text-3xl text-foreground">Habit Buckets</h1>
          <Link href="/history" className="mt-1 inline-block text-xs font-semibold text-primary underline">
            View history
          </Link>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </header>

      <section className="surface-card space-y-3 p-4 text-card-foreground">
        <h2 className="text-sm font-medium text-muted-foreground">Today&apos;s buckets</h2>
        <ul className="space-y-2">
          {dashboard.buckets.map((bucket) => {
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
        <h2 className="text-sm font-medium text-muted-foreground">Activities</h2>

        {params.error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p>
        ) : null}

        {dashboard.hasActivities ? (
          <ul className="space-y-2">
            {dashboard.activities.map((activity) => {
              const toggleTone = getActivityToggleTone(activity.completed)

              return (
                <li key={activity.id} className="rounded-xl border border-border/90 bg-white/70 px-3 py-2">
                <form action={toggleActivityAction}>
                  <input type="hidden" name="activityId" value={activity.id} />
                  <input type="hidden" name="date" value={todayState.date} />
                  <button
                    type="submit"
                    className="touch-target flex w-full items-center justify-between gap-2 rounded-md text-left"
                  >
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.bucketNames.join(", ") || "No buckets"}
                      </p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${toggleTone.badgeClass}`}>
                      {toggleTone.label}
                    </span>
                  </button>
                </form>
              </li>
              )
            })}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            No activities yet. Add one below to start completing buckets.
          </div>
        )}

        <form action={createActivityAction} className="rounded-xl border border-border/90 bg-white/70 p-3">
          <h3 className="text-sm font-semibold">Add activity</h3>
          <div className="mt-2 space-y-2">
              <input
                required
                name="name"
                type="text"
                placeholder="Activity name"
                className="touch-target w-full rounded-lg border border-input bg-background/90 px-3 py-2 text-sm"
              />
            <div className="space-y-2">
              {todayState.buckets.map((bucket) => (
                <label key={`create-${bucket.id}`} className="touch-target flex items-center gap-2 text-sm">
                  <input className="size-5" type="checkbox" name="bucketIds" value={bucket.id} />
                  <span>{bucket.name}</span>
                </label>
              ))}
            </div>
            <FormSubmitButton idleLabel="Add activity" className="w-full" />
          </div>
        </form>

        {todayState.activities.length > 0 ? (
          <div className="space-y-2 rounded-xl border border-border/90 bg-white/70 p-3">
            <h3 className="text-sm font-semibold">Edit activities</h3>
            <ul className="space-y-3">
              {todayState.activities.map((activity) => (
                <li key={`edit-${activity.id}`} className="rounded-lg border border-border/90 bg-background/75 p-2">
                  <form action={updateActivityAction} className="space-y-2">
                    <input type="hidden" name="activityId" value={activity.id} />
                    <input
                      required
                      type="text"
                      name="name"
                      defaultValue={activity.name}
                      className="touch-target w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                    />
                    <div className="space-y-2">
                      {todayState.buckets.map((bucket) => (
                        <label key={`edit-${activity.id}-${bucket.id}`} className="touch-target flex items-center gap-2 text-sm">
                          <input
                            className="size-5"
                            type="checkbox"
                            name="bucketIds"
                            value={bucket.id}
                            defaultChecked={activity.bucketIds.includes(bucket.id)}
                          />
                          <span>{bucket.name}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <FormSubmitButton idleLabel="Save" className="w-full" />
                    </div>
                  </form>
                  <form action={deleteActivityAction} className="mt-2">
                    <input type="hidden" name="activityId" value={activity.id} />
                    <FormSubmitButton
                      idleLabel="Delete"
                      pendingLabel="Deleting..."
                      className="w-full border-red-200 bg-red-50 text-red-700"
                    />
                  </form>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <p className="mt-2 text-xs text-muted-foreground">Signed in as {user.email}</p>
    </main>
  )
}
