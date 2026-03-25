import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import {
  DEFAULT_BUCKET_NAMES,
  isValidBucketName,
  normalizeBucketName,
} from "@/lib/supabase/schema"

const migrationPath = join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260325190000_mvp_schema.sql"
)
const migrationSql = readFileSync(migrationPath, "utf8")

describe("schema helpers", () => {
  it("exposes the expected default buckets", () => {
    expect(DEFAULT_BUCKET_NAMES).toEqual(["Body", "Life", "People"])
  })

  it("normalizes bucket names", () => {
    expect(normalizeBucketName("  Deep   Work ")).toBe("Deep Work")
    expect(isValidBucketName("   ")).toBe(false)
    expect(isValidBucketName("Body")).toBe(true)
  })
})

describe("migration SQL", () => {
  it("creates required tables", () => {
    expect(migrationSql).toContain("create table public.buckets")
    expect(migrationSql).toContain("create table public.activities")
    expect(migrationSql).toContain("create table public.activity_buckets")
    expect(migrationSql).toContain("create table public.activity_logs")
  })

  it("enables RLS on all domain tables", () => {
    expect(migrationSql).toContain("alter table public.buckets enable row level security")
    expect(migrationSql).toContain("alter table public.activities enable row level security")
    expect(migrationSql).toContain("alter table public.activity_buckets enable row level security")
    expect(migrationSql).toContain("alter table public.activity_logs enable row level security")
  })

  it("seeds default buckets for new auth users", () => {
    expect(migrationSql).toContain("create or replace function public.seed_default_buckets_for_new_user")
    expect(migrationSql).toContain("(new.id, 'Body')")
    expect(migrationSql).toContain("(new.id, 'Life')")
    expect(migrationSql).toContain("(new.id, 'People')")
  })
})
