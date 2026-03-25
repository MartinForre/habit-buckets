import type { PostgrestError } from "@supabase/supabase-js"

export type DbResult<T> = {
  data: T | null
  error: PostgrestError | null
}

export function unwrapDbResult<T>(result: DbResult<T>, context: string): T {
  if (result.error) {
    throw new Error(`${context}: ${result.error.message}`)
  }

  if (result.data === null) {
    throw new Error(`${context}: no data returned`)
  }

  return result.data
}
