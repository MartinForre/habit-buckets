"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { assertDateKey, createHabitServiceFromClient } from "@/lib/domain"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function getString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function getStringArray(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean)
}

function dashboardErrorPath(message: string): string {
  return `/dashboard?error=${encodeURIComponent(message)}`
}

export async function toggleActivityAction(formData: FormData): Promise<void> {
  const activityId = getString(formData, "activityId").trim()
  const date = assertDateKey(getString(formData, "date").trim())

  if (!activityId) {
    throw new Error("Missing activity id")
  }

  const supabase = await createSupabaseServerClient()
  const service = createHabitServiceFromClient(supabase)

  await service.toggleActivityCompletion(activityId, { date })
  revalidatePath("/dashboard")
}

export async function createActivityAction(formData: FormData): Promise<void> {
  const name = getString(formData, "name")
  const bucketIds = getStringArray(formData, "bucketIds")

  try {
    const supabase = await createSupabaseServerClient()
    const service = createHabitServiceFromClient(supabase)
    await service.createActivity({ name, bucketIds })
    revalidatePath("/dashboard")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create activity"
    redirect(dashboardErrorPath(message))
  }
}

export async function updateActivityAction(formData: FormData): Promise<void> {
  const activityId = getString(formData, "activityId").trim()
  const name = getString(formData, "name")
  const bucketIds = getStringArray(formData, "bucketIds")

  if (!activityId) {
    redirect(dashboardErrorPath("Missing activity id"))
  }

  try {
    const supabase = await createSupabaseServerClient()
    const service = createHabitServiceFromClient(supabase)
    await service.updateActivity(activityId, { name, bucketIds })
    revalidatePath("/dashboard")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update activity"
    redirect(dashboardErrorPath(message))
  }
}

export async function deleteActivityAction(formData: FormData): Promise<void> {
  const activityId = getString(formData, "activityId").trim()

  if (!activityId) {
    redirect(dashboardErrorPath("Missing activity id"))
  }

  try {
    const supabase = await createSupabaseServerClient()
    const service = createHabitServiceFromClient(supabase)
    await service.deleteActivity(activityId)
    revalidatePath("/dashboard")
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete activity"
    redirect(dashboardErrorPath(message))
  }
}
