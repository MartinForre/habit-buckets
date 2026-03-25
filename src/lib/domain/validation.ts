import { UserSafeError } from "@/lib/domain/errors"
import type { ActivityPayload } from "@/lib/domain/types"

function normalizeActivityName(name: string): string {
  return name.trim().replace(/\s+/g, " ")
}

export function validateActivityPayload(input: ActivityPayload): ActivityPayload {
  const name = normalizeActivityName(input.name)

  if (!name) {
    throw new UserSafeError("Activity name is required")
  }

  if (name.length > 120) {
    throw new UserSafeError("Activity name must be 120 characters or fewer")
  }

  const bucketIds = Array.from(new Set(input.bucketIds.map((bucketId) => bucketId.trim())))
    .filter(Boolean)

  if (bucketIds.length === 0) {
    throw new UserSafeError("Select at least one bucket")
  }

  return {
    name,
    bucketIds,
  }
}
