import type { DailyState } from "@/lib/domain"

export type HistoryDayViewModel = {
  date: string
  completedBucketNames: string[]
  completedActivityNames: string[]
  hasLogs: boolean
}

export type HistoryDateOption = {
  date: string
  href: string
  selected: boolean
}

export function createHistoryDayViewModel(state: DailyState): HistoryDayViewModel {
  const completedBucketNames = state.buckets
    .filter((bucket) => bucket.completed)
    .map((bucket) => bucket.name)

  const completedActivityNames = state.activities
    .filter((activity) => activity.completed)
    .map((activity) => activity.name)

  return {
    date: state.date,
    completedBucketNames,
    completedActivityNames,
    hasLogs: completedActivityNames.length > 0,
  }
}

export function createHistoryDateOptions(
  dates: string[],
  selectedDate: string,
  maxItems = 14
): HistoryDateOption[] {
  const uniqueDates = Array.from(new Set([...dates, selectedDate]))
  const sortedDates = uniqueDates.sort((a, b) => (a < b ? 1 : -1)).slice(0, maxItems)

  return sortedDates.map((date) => ({
    date,
    href: `/history?date=${encodeURIComponent(date)}`,
    selected: date === selectedDate,
  }))
}
