import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { assertDateKey, createHabitServiceFromClient, getTodayDateKey } from "@/lib/domain"
import {
  createHistoryDateOptions,
  createHistoryDayViewModel,
} from "@/lib/history/view-model"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type HistoryPageProps = {
  searchParams: Promise<{
    date?: string
  }>
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const params = await searchParams
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const service = createHabitServiceFromClient(supabase)
  const selectedDate = params.date ? assertDateKey(params.date) : getTodayDateKey("UTC")

  const [dayState, recentDates] = await Promise.all([
    service.fetchHistoryDay(selectedDate),
    service.listRecentHistoryDates(21),
  ])

  const day = createHistoryDayViewModel(dayState)
  const dateOptions = createHistoryDateOptions(recentDates, selectedDate, 14)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-10 sm:px-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">History</p>
          <h1 className="text-2xl font-semibold tracking-tight">{day.date}</h1>
        </div>
        <Link href="/dashboard">
          <Button size="sm" variant="outline">
            Back
          </Button>
        </Link>
      </header>

      <section className="space-y-2 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Recent days</h2>
        <ul className="grid grid-cols-2 gap-2">
          {dateOptions.map((option) => (
            <li key={option.date}>
              <Link
                href={option.href}
                className={`block rounded-lg border px-3 py-2 text-sm ${
                  option.selected ? "border-emerald-300 bg-emerald-50" : "border-border"
                }`}
              >
                {option.date}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 space-y-3 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Completed buckets</h2>
        {day.completedBucketNames.length > 0 ? (
          <ul className="space-y-2">
            {day.completedBucketNames.map((name) => (
              <li key={name} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
            No buckets were completed on this day.
          </p>
        )}
      </section>

      <section className="mt-4 space-y-3 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Completed activities</h2>
        {day.hasLogs ? (
          <ul className="space-y-2">
            {day.completedActivityNames.map((name) => (
              <li key={name} className="rounded-lg border px-3 py-2 text-sm">
                {name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
            No activities were completed on this day.
          </p>
        )}
      </section>
    </main>
  )
}
