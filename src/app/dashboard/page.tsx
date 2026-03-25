import Link from "next/link"
import { redirect } from "next/navigation"

import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/auth/actions"
import { toggleActivityAction } from "@/app/dashboard/actions"
import { createHabitServiceFromClient } from "@/lib/domain"
import { getActivityToggleTone, getBucketTone } from "@/lib/dashboard/interaction-state"
import { createDashboardViewModel } from "@/lib/dashboard/view-model"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
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
    <main className="app-shell flex min-h-screen flex-col gap-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <header className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{dashboard.dateLabel}</p>
          <h1 className="mt-1 text-3xl text-foreground">Today</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tap activities to complete your buckets.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/dashboard/manage">
            <Button variant="outline" size="sm" className="w-full">
              Manage
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" size="sm" className="w-full">
              History
            </Button>
          </Link>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
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
        <h2 className="text-sm font-medium text-muted-foreground">Tap to toggle</h2>

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
            No activities yet. Go to Manage to add your first activity.
            <div className="mt-3">
              <Link href="/dashboard/manage">
                <Button size="sm">Open Manage</Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      <p className="mt-2 text-xs text-muted-foreground">Signed in as {user.email}</p>
      <BottomNav current="today" />
    </main>
  )
}
