import { redirect } from "next/navigation"

import { DEFAULT_AUTHENTICATED_REDIRECT } from "@/lib/auth/guards"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(DEFAULT_AUTHENTICATED_REDIRECT)
  }

  redirect("/login")
}
