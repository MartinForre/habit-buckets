import { describe, expect, it, vi } from "vitest"

import { createHabitService } from "@/lib/domain/service"

function createRepositoryMock() {
  return {
    listBuckets: vi.fn(),
    listActivitiesWithBucketIds: vi.fn(),
    listActivityLogsForDate: vi.fn(),
    getActivityLogForDate: vi.fn(),
    upsertActivityLog: vi.fn(),
    createActivityWithBuckets: vi.fn(),
    updateActivityWithBuckets: vi.fn(),
    deleteActivityById: vi.fn(),
  }
}

describe("habit service", () => {
  it("builds daily state for today and computes bucket completion", async () => {
    const repo = createRepositoryMock()
    repo.listBuckets.mockResolvedValue([
      { id: "b1", name: "Body" },
      { id: "b2", name: "People" },
    ])
    repo.listActivitiesWithBucketIds.mockResolvedValue([
      { id: "a1", name: "Gym", bucket_ids: ["b1"] },
      { id: "a2", name: "Call friend", bucket_ids: ["b2"] },
    ])
    repo.listActivityLogsForDate.mockResolvedValue([
      { activity_id: "a1", completed: true },
      { activity_id: "a2", completed: false },
    ])

    const service = createHabitService(repo)
    const state = await service.fetchDayState("2026-03-25")

    expect(state.date).toBe("2026-03-25")
    expect(state.buckets).toEqual([
      { id: "b1", name: "Body", completed: true },
      { id: "b2", name: "People", completed: false },
    ])
    expect(state.activities).toEqual([
      { id: "a1", name: "Gym", bucketIds: ["b1"], completed: true },
      { id: "a2", name: "Call friend", bucketIds: ["b2"], completed: false },
    ])
  })

  it("toggles completion for a date-scoped activity log", async () => {
    const repo = createRepositoryMock()
    repo.getActivityLogForDate.mockResolvedValue({ completed: true })
    repo.upsertActivityLog.mockResolvedValue({ activity_id: "a1", completed: false })

    const service = createHabitService(repo)
    const result = await service.toggleActivityCompletion("a1", { date: "2026-03-25" })

    expect(repo.getActivityLogForDate).toHaveBeenCalledWith("a1", "2026-03-25")
    expect(repo.upsertActivityLog).toHaveBeenCalledWith({
      activityId: "a1",
      date: "2026-03-25",
      completed: false,
    })
    expect(result).toEqual({
      activityId: "a1",
      date: "2026-03-25",
      completed: false,
    })
  })

  it("creates a completed log when no log exists for that date", async () => {
    const repo = createRepositoryMock()
    repo.getActivityLogForDate.mockResolvedValue(null)
    repo.upsertActivityLog.mockResolvedValue({ activity_id: "a2", completed: true })

    const service = createHabitService(repo)
    const result = await service.toggleActivityCompletion("a2", { date: "2026-03-24" })

    expect(repo.getActivityLogForDate).toHaveBeenCalledWith("a2", "2026-03-24")
    expect(repo.upsertActivityLog).toHaveBeenCalledWith({
      activityId: "a2",
      date: "2026-03-24",
      completed: true,
    })
    expect(result).toEqual({
      activityId: "a2",
      date: "2026-03-24",
      completed: true,
    })
  })

  it("validates payloads for create and update activity", async () => {
    const repo = createRepositoryMock()
    repo.createActivityWithBuckets.mockResolvedValue({ id: "a1", name: "Disc golf" })
    repo.updateActivityWithBuckets.mockResolvedValue({ id: "a1", name: "Walk" })

    const service = createHabitService(repo)

    await service.createActivity({
      name: "  Disc   golf ",
      bucketIds: ["body", "people", "body"],
    })

    expect(repo.createActivityWithBuckets).toHaveBeenCalledWith("Disc golf", ["body", "people"])

    await service.updateActivity("a1", {
      name: " Walk ",
      bucketIds: ["body"],
    })

    expect(repo.updateActivityWithBuckets).toHaveBeenCalledWith("a1", {
      name: "Walk",
      bucketIds: ["body"],
    })
  })

  it("rejects update when no buckets are selected", async () => {
    const repo = createRepositoryMock()
    const service = createHabitService(repo)

    await expect(
      service.updateActivity("a1", {
        name: "Walk",
        bucketIds: [],
      })
    ).rejects.toThrow("Select at least one bucket")

    expect(repo.updateActivityWithBuckets).not.toHaveBeenCalled()
  })

  it("deletes activities through repository", async () => {
    const repo = createRepositoryMock()
    repo.deleteActivityById.mockResolvedValue(undefined)

    const service = createHabitService(repo)
    await service.deleteActivity("a1")

    expect(repo.deleteActivityById).toHaveBeenCalledWith("a1")
  })
})
