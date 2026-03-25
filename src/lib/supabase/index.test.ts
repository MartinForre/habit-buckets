import { describe, expect, it } from "vitest"

import {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
} from "@/lib/supabase"

describe("supabase exports", () => {
  it("exposes browser and server client factories", () => {
    expect(typeof createSupabaseBrowserClient).toBe("function")
    expect(typeof createSupabaseServerClient).toBe("function")
  })
})
