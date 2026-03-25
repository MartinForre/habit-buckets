import { describe, expect, it } from "vitest"

import {
  createHistoryDateOptions,
  createHistoryDayViewModel,
} from "@/lib/history/view-model"

describe("createHistoryDayViewModel", () => {
  it("returns completed buckets and activities for a selected day", () => {
    const result = createHistoryDayViewModel({
      date: "2026-03-25",
      buckets: [
        { id: "b1", name: "Body", completed: true },
        { id: "b2", name: "People", completed: false },
      ],
      activities: [
        { id: "a1", name: "Gym", bucketIds: ["b1"], completed: true },
        { id: "a2", name: "Call friend", bucketIds: ["b2"], completed: false },
      ],
    })

    expect(result.completedBucketNames).toEqual(["Body"])
    expect(result.completedActivityNames).toEqual(["Gym"])
    expect(result.hasLogs).toBe(true)
  })

  it("shows no logs state when no completed activities exist", () => {
    const result = createHistoryDayViewModel({
      date: "2026-03-24",
      buckets: [{ id: "b1", name: "Body", completed: false }],
      activities: [{ id: "a1", name: "Walk", bucketIds: ["b1"], completed: false }],
    })

    expect(result.hasLogs).toBe(false)
  })
})

describe("createHistoryDateOptions", () => {
  it("deduplicates, sorts by descending date, and marks selected", () => {
    const options = createHistoryDateOptions(
      ["2026-03-21", "2026-03-20", "2026-03-21", "2026-03-22"],
      "2026-03-20",
      3
    )

    expect(options.map((item) => item.date)).toEqual(["2026-03-22", "2026-03-21", "2026-03-20"])
    expect(options.find((item) => item.date === "2026-03-20")?.selected).toBe(true)
  })
})
