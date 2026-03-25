import { describe, expect, it } from "vitest"

import { UserSafeError } from "@/lib/domain/errors"
import { validateActivityPayload } from "@/lib/domain/validation"

describe("validateActivityPayload", () => {
  it("normalizes name and bucket ids", () => {
    const result = validateActivityPayload({
      name: "  Disc   golf  ",
      bucketIds: ["body", " people ", "body"],
    })

    expect(result).toEqual({
      name: "Disc golf",
      bucketIds: ["body", "people"],
    })
  })

  it("rejects invalid payloads with user-safe errors", () => {
    expect(() =>
      validateActivityPayload({
        name: "   ",
        bucketIds: ["body"],
      })
    ).toThrow(UserSafeError)

    expect(() =>
      validateActivityPayload({
        name: "Walk",
        bucketIds: [],
      })
    ).toThrow("Select at least one bucket")
  })
})
