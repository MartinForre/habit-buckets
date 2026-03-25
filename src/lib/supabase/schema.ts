export const DEFAULT_BUCKET_NAMES = ["Body", "Life", "People"] as const

export function normalizeBucketName(name: string): string {
  return name.trim().replace(/\s+/g, " ")
}

export function isValidBucketName(name: string): boolean {
  const normalized = normalizeBucketName(name)
  return normalized.length > 0 && normalized.length <= 80
}
