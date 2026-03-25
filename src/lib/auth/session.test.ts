import { describe, expect, it, vi } from "vitest"

import { isSessionActive } from "@/lib/auth/session"

describe("isSessionActive", () => {
  it("returns false for missing access token", () => {
    expect(isSessionActive(null)).toBe(false)
    expect(isSessionActive({ access_token: null })).toBe(false)
  })

  it("returns true when token exists and no explicit expiry", () => {
    expect(isSessionActive({ access_token: "token" })).toBe(true)
  })

  it("uses expires_at when present", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-25T12:00:00Z"))

    expect(isSessionActive({ access_token: "token", expires_at: 1_775_000_000 })).toBe(true)
    expect(isSessionActive({ access_token: "token", expires_at: 1_700_000_000 })).toBe(false)

    vi.useRealTimers()
  })
})
