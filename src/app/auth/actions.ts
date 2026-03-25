"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { resolveSignedInRedirect } from "@/lib/auth/guards"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export async function signInAction(formData: FormData): Promise<void> {
  const email = getFormValue(formData, "email")
  const password = getFormValue(formData, "password")
  const next = getFormValue(formData, "next")

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`)
  }

  revalidatePath("/", "layout")
  redirect(resolveSignedInRedirect(next))
}

export async function signUpAction(formData: FormData): Promise<void> {
  const email = getFormValue(formData, "email")
  const password = getFormValue(formData, "password")

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  redirect("/login?message=Account%20created.%20Please%20sign%20in.")
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login?message=Signed%20out")
}
