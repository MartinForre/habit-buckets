import Link from "next/link"
import { redirect } from "next/navigation"

import { BottomNav } from "@/components/bottom-nav"
import { DashboardLiveSections } from "@/components/dashboard-live-sections"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/auth/actions"
import { createHabitServiceFromClient } from "@/lib/domain"
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

      <DashboardLiveSections initialState={todayState} />

      <p className="mt-2 text-xs text-muted-foreground">Signed in as {user.email}</p>
      <BottomNav current="today" />
    </main>
  )
}
