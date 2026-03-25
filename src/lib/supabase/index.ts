export { createSupabaseBrowserClient } from "@/lib/supabase/client"
export { createSupabaseServerClient } from "@/lib/supabase/server"
export {
  createActivityWithBuckets,
  createBucket,
  deleteActivityById,
  ensureDefaultBuckets,
  getActivityLogForDate,
  listActivities,
  listActivitiesWithBucketIds,
  listActivityLogDates,
  listActivityLogsForDate,
  listBuckets,
  updateActivityWithBuckets,
  upsertActivityLog,
} from "@/lib/supabase/repositories"
export { DEFAULT_BUCKET_NAMES, isValidBucketName, normalizeBucketName } from "@/lib/supabase/schema"
