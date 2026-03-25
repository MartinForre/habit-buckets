import Link from "next/link"

import { Button } from "@/components/ui/button"

import { signUpAction } from "@/app/auth/actions"

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams

  return (
    <main className="app-shell flex min-h-screen flex-col justify-center">
      <section className="surface-card p-6 text-card-foreground sm:p-8">
        <h1 className="text-3xl">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up your account to start tracking your daily bucket wins.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p>
        ) : null}

        <form action={signUpAction} className="mt-5 space-y-4">
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
              autoComplete="new-password"
              minLength={8}
              className="touch-target w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </label>

          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-foreground underline" href="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  )
}
