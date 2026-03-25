import { describe, expect, it } from "vitest"

import { getActivityToggleTone, getBucketTone } from "@/lib/dashboard/interaction-state"

describe("dashboard interaction state", () => {
  it("maps complete and incomplete bucket tones", () => {
    expect(getBucketTone(true)).toEqual({
      containerClass: "border-emerald-200 bg-emerald-50 text-emerald-900",
      badgeClass: "bg-emerald-100 text-emerald-800",
      label: "Complete",
    })

    expect(getBucketTone(false)).toEqual({
      containerClass: "border-border bg-muted/40",
      badgeClass: "bg-zinc-200 text-zinc-700",
      label: "Incomplete",
    })
  })

  it("maps activity toggle labels", () => {
    expect(getActivityToggleTone(true).label).toBe("Checked")
    expect(getActivityToggleTone(false).label).toBe("Tap to check")
  })
})
