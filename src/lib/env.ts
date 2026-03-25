export type SupabasePublicEnv = {
  url: string
  anonKey: string
}

type EnvSource = Record<string, string | undefined>

function requireEnv(source: EnvSource, key: string): string {
  const value = source[key]?.trim()

  if (!value) {
    throw new Error(`Missing ${key}`)
  }

  return value
}

function requireUrl(value: string, key: string): string {
  try {
    const url = new URL(value)

    if (url.protocol !== "https:") {
      throw new Error()
    }

    return value
  } catch {
    throw new Error(`Invalid ${key}: expected an https URL`)
  }
}

export function parseSupabasePublicEnv(source: EnvSource = process.env): SupabasePublicEnv {
  const supabaseUrl = requireUrl(
    requireEnv(source, "NEXT_PUBLIC_SUPABASE_URL"),
    "NEXT_PUBLIC_SUPABASE_URL"
  )
  const supabaseAnonKey = requireEnv(source, "NEXT_PUBLIC_SUPABASE_ANON_KEY")

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  }
}

export function assertRequiredEnv(source: EnvSource = process.env): void {
  parseSupabasePublicEnv(source)
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  return parseSupabasePublicEnv(process.env)
}
