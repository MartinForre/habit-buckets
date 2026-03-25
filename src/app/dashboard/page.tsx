import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/auth/actions"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-10 sm:px-6">
      <section className="rounded-2xl border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <h1 className="mt-1 text-lg font-semibold">{user.email}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Auth is configured. Next tasks will build the full daily buckets dashboard.
        </p>

        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>
    </main>
  )
}
