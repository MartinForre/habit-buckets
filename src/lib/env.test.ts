import { afterEach, describe, expect, it } from "vitest"

import { assertRequiredEnv, getSupabasePublicEnv, parseSupabasePublicEnv } from "@/lib/env"

const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const originalAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

afterEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnon
})

describe("getSupabasePublicEnv", () => {
  it("returns public supabase configuration when present", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"

    expect(getSupabasePublicEnv()).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    })
  })

  it("throws when supabase URL is missing", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = ""
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"

    expect(() => getSupabasePublicEnv()).toThrow("Missing NEXT_PUBLIC_SUPABASE_URL")
  })

  it("throws when supabase URL is not https", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://example.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"

    expect(() => getSupabasePublicEnv()).toThrow("Invalid NEXT_PUBLIC_SUPABASE_URL")
  })

  it("supports parsing from an explicit source", () => {
    expect(
      parseSupabasePublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      })
    ).toEqual({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    })
  })

  it("asserts required env values", () => {
    expect(() =>
      assertRequiredEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      })
    ).not.toThrow()
  })
})
