import { describe, expect, it } from "vitest"

import {
  DEFAULT_AUTHENTICATED_REDIRECT,
  createLoginRedirectPath,
  isAuthRoute,
  isProtectedRoute,
  resolveSignedInRedirect,
} from "@/lib/auth/guards"

describe("auth guards", () => {
  it("detects auth routes", () => {
    expect(isAuthRoute("/login")).toBe(true)
    expect(isAuthRoute("/signup")).toBe(true)
    expect(isAuthRoute("/dashboard")).toBe(false)
  })

  it("detects protected routes", () => {
    expect(isProtectedRoute("/")).toBe(true)
    expect(isProtectedRoute("/dashboard")).toBe(true)
    expect(isProtectedRoute("/dashboard/history")).toBe(true)
    expect(isProtectedRoute("/history")).toBe(true)
    expect(isProtectedRoute("/login")).toBe(false)
  })

  it("builds login redirect paths with next param", () => {
    expect(createLoginRedirectPath("/dashboard", "?tab=today")).toBe(
      "/login?next=%2Fdashboard%3Ftab%3Dtoday"
    )
  })

  it("resolves signed-in redirect safely", () => {
    expect(resolveSignedInRedirect("/dashboard?tab=today")).toBe("/dashboard?tab=today")
    expect(resolveSignedInRedirect("https://evil.example.com")).toBe(
      DEFAULT_AUTHENTICATED_REDIRECT
    )
    expect(resolveSignedInRedirect("//evil.example.com")).toBe(DEFAULT_AUTHENTICATED_REDIRECT)
    expect(resolveSignedInRedirect(undefined)).toBe(DEFAULT_AUTHENTICATED_REDIRECT)
  })
})
