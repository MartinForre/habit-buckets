import { afterEach, describe, expect, it } from "vitest"

import { getSupabasePublicEnv } from "@/lib/env"

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
})
