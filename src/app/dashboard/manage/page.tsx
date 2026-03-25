import Link from "next/link"
import { redirect } from "next/navigation"

import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { FormSubmitButton } from "@/components/form-submit-button"
import {
  createActivityAction,
  deleteActivityAction,
  updateActivityAction,
} from "@/app/dashboard/actions"
import { createHabitServiceFromClient } from "@/lib/domain"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type ManagePageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function DashboardManagePage({ searchParams }: ManagePageProps) {
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

  return (
    <main className="app-shell flex min-h-screen flex-col gap-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <header className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">Dashboard setup</p>
          <h1 className="mt-1 text-3xl text-foreground">Manage activities</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit, and assign buckets.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            Back to Today
          </Button>
        </Link>
      </header>

      {params.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p>
      ) : null}

      <section className="surface-card space-y-3 p-4 text-card-foreground">
        <h2 className="text-sm font-medium text-muted-foreground">Add activity</h2>
        <form action={createActivityAction} className="rounded-xl border border-border/90 bg-white/70 p-3">
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
      </section>

      {todayState.activities.length > 0 ? (
        <section className="surface-card space-y-2 p-4 text-card-foreground">
          <h2 className="text-sm font-medium text-muted-foreground">Edit activities</h2>
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
        </section>
      ) : (
        <section className="surface-card p-4 text-sm text-muted-foreground">
          No activities yet. Create your first activity above.
        </section>
      )}
      <BottomNav current="manage" />
    </main>
  )
}
