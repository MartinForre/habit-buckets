import { describe, expect, it, vi } from "vitest"

import {
  createActivityWithBuckets,
  ensureDefaultBuckets,
  listBuckets,
  updateActivityWithBuckets,
  upsertActivityLog,
} from "@/lib/supabase/repositories"

describe("supabase repositories", () => {
  it("lists buckets from buckets table", async () => {
    const order = vi.fn().mockResolvedValue({
      data: [{ id: "b1", name: "Body", created_at: "2026-01-01T00:00:00Z" }],
      error: null,
    })

    const select = vi.fn().mockReturnValue({ order })
    const from = vi.fn().mockReturnValue({ select })

    const buckets = await listBuckets({ from } as never)

    expect(from).toHaveBeenCalledWith("buckets")
    expect(buckets).toHaveLength(1)
    expect(order).toHaveBeenCalledWith("created_at", { ascending: true })
  })

  it("ensures default buckets via RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: null })

    await ensureDefaultBuckets({ rpc } as never)

    expect(rpc).toHaveBeenCalledWith("ensure_default_buckets_for_current_user")
  })

  it("creates activity and bucket mappings with authenticated user id", async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: "a1", name: "Disc golf", created_at: "2026-01-01T00:00:00Z" },
      error: null,
    })

    const activitySelect = vi.fn().mockReturnValue({ single })
    const activityInsert = vi.fn().mockReturnValue({ select: activitySelect })

    const mappingSelect = vi.fn().mockResolvedValue({ data: [{ id: "m1" }], error: null })
    const mappingInsert = vi.fn().mockReturnValue({ select: mappingSelect })

    const from = vi.fn((table: string) => {
      if (table === "activities") {
        return { insert: activityInsert }
      }

      if (table === "activity_buckets") {
        return { insert: mappingInsert }
      }

      throw new Error(`Unexpected table ${table}`)
    })

    const auth = {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
    }

    await createActivityWithBuckets({ from, auth } as never, "Disc golf", ["bucket-1", "bucket-2"])

    expect(activityInsert).toHaveBeenCalledWith({ name: "Disc golf", user_id: "user-1" })
    expect(mappingInsert).toHaveBeenCalledWith([
      { activity_id: "a1", bucket_id: "bucket-1" },
      { activity_id: "a1", bucket_id: "bucket-2" },
    ])
    expect(JSON.stringify(mappingInsert.mock.calls[0][0])).not.toContain("user_id")
  })

  it("upserts activity logs on user_id,activity_id,date conflict", async () => {
    const single = vi.fn().mockResolvedValue({
      data: {
        id: "l1",
        activity_id: "a1",
        date: "2026-03-25",
        completed: true,
        created_at: "2026-03-25T12:00:00Z",
      },
      error: null,
    })

    const select = vi.fn().mockReturnValue({ single })
    const upsert = vi.fn().mockReturnValue({ select })
    const from = vi.fn().mockReturnValue({ upsert })
    const auth = {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } }, error: null }),
    }

    await upsertActivityLog({ from, auth } as never, {
      activityId: "a1",
      date: "2026-03-25",
      completed: true,
    })

    expect(from).toHaveBeenCalledWith("activity_logs")
    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: "user-1",
        activity_id: "a1",
        date: "2026-03-25",
        completed: true,
      },
      {
        onConflict: "user_id,activity_id,date",
      }
    )
  })

  it("updates activity and rewrites bucket mappings", async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: "a1", name: "New name", created_at: "2026-01-01T00:00:00Z" },
      error: null,
    })

    const selectForUpdate = vi.fn().mockReturnValue({ single })
    const eqForUpdate = vi.fn().mockReturnValue({ select: selectForUpdate })
    const update = vi.fn().mockReturnValue({ eq: eqForUpdate })

    const selectForDeleteMappings = vi.fn().mockResolvedValue({ data: [{ id: "m1" }], error: null })
    const eqForDeleteMappings = vi.fn().mockReturnValue({ select: selectForDeleteMappings })
    const deleteFn = vi.fn().mockReturnValue({ eq: eqForDeleteMappings })

    const selectForInsertMappings = vi.fn().mockResolvedValue({ data: [{ id: "m2" }], error: null })
    const insertForMappings = vi.fn().mockReturnValue({ select: selectForInsertMappings })

    const from = vi.fn((table: string) => {
      if (table === "activities") {
        return { update }
      }

      if (table === "activity_buckets") {
        return {
          delete: deleteFn,
          insert: insertForMappings,
        }
      }

      throw new Error(`Unexpected table ${table}`)
    })

    await updateActivityWithBuckets(
      { from } as never,
      "a1",
      { name: "New name", bucketIds: ["body", "people"] }
    )

    expect(update).toHaveBeenCalledWith({ name: "New name" })
    expect(deleteFn).toHaveBeenCalled()
    expect(insertForMappings).toHaveBeenCalledWith([
      { activity_id: "a1", bucket_id: "body" },
      { activity_id: "a1", bucket_id: "people" },
    ])
  })
})
