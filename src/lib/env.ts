export type SupabasePublicEnv = {
  url: string
  anonKey: string
}

type EnvSource = Record<string, string | undefined>

function requireNamedEnv(value: string | undefined, key: string): string {
  const normalized = value?.trim()

  if (!normalized) {
    throw new Error(`Missing ${key}`)
  }

  return normalized
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
  const isDefaultSource = source === process.env

  const rawUrl = isDefaultSource
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : source.NEXT_PUBLIC_SUPABASE_URL

  const rawAnonKey = isDefaultSource
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    : source.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const supabaseUrl = requireUrl(
    requireNamedEnv(rawUrl, "NEXT_PUBLIC_SUPABASE_URL"),
    "NEXT_PUBLIC_SUPABASE_URL"
  )
  const supabaseAnonKey = requireNamedEnv(rawAnonKey, "NEXT_PUBLIC_SUPABASE_ANON_KEY")

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
