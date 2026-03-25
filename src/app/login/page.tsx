import Link from "next/link"

import { Button } from "@/components/ui/button"

import { signInAction } from "@/app/auth/actions"

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
    message?: string
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const next = params.next ?? ""

  return (
    <main className="app-shell flex min-h-screen flex-col justify-center">
      <section className="surface-card p-6 text-card-foreground sm:p-8">
        <h1 className="text-3xl">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue to your daily Habit Buckets dashboard.
        </p>

        {params.message ? (
          <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {params.message}
          </p>
        ) : null}

        {params.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p>
        ) : null}

        <form action={signInAction} className="mt-5 space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block space-y-1">
            <span className="text-sm font-medium">Email</span>
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="touch-target w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Password</span>
            <input
              required
              name="password"
              type="password"
              autoComplete="current-password"
              className="touch-target w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </label>

          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          New here?{" "}
          <Link className="font-medium text-foreground underline" href="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
