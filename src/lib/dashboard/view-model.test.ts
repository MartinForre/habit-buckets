import { describe, expect, it } from "vitest"

import { createDashboardViewModel } from "@/lib/dashboard/view-model"

describe("createDashboardViewModel", () => {
  it("maps bucket completion labels and activity bucket names", () => {
    const viewModel = createDashboardViewModel(
      {
        date: "2026-03-25",
        buckets: [
          { id: "b1", name: "Body", completed: true },
          { id: "b2", name: "People", completed: false },
        ],
        activities: [
          { id: "a1", name: "Gym", bucketIds: ["b1"], completed: true },
          { id: "a2", name: "Call friend", bucketIds: ["b2"], completed: false },
        ],
      },
      { locale: "en-US", timeZone: "UTC" }
    )

    expect(viewModel.buckets).toEqual([
      { id: "b1", name: "Body", completed: true, statusLabel: "Complete" },
      { id: "b2", name: "People", completed: false, statusLabel: "Incomplete" },
    ])

    expect(viewModel.activities[0]?.bucketNames).toEqual(["Body"])
    expect(viewModel.activities[1]?.bucketNames).toEqual(["People"])
    expect(viewModel.hasActivities).toBe(true)
  })

  it("reports empty-state activity flag", () => {
    const viewModel = createDashboardViewModel(
      {
        date: "2026-03-25",
        buckets: [{ id: "b1", name: "Body", completed: false }],
        activities: [],
      },
      { locale: "en-US", timeZone: "UTC" }
    )

    expect(viewModel.hasActivities).toBe(false)
  })
})
