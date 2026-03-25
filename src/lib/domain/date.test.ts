import { describe, expect, it } from "vitest"

import { assertDateKey, getTodayDateKey, isDateKey } from "@/lib/domain/date"

describe("date utilities", () => {
  it("returns date keys per timezone boundary", () => {
    const now = new Date("2026-03-26T01:30:00.000Z")

    expect(getTodayDateKey("UTC", now)).toBe("2026-03-26")
    expect(getTodayDateKey("America/Los_Angeles", now)).toBe("2026-03-25")
  })

  it("validates date key format", () => {
    expect(isDateKey("2026-03-25")).toBe(true)
    expect(isDateKey("03-25-2026")).toBe(false)
    expect(() => assertDateKey("2026/03/25")).toThrow(
      "Please provide a valid date in YYYY-MM-DD format"
    )
  })
})
