export const AUTH_ROUTES = ["/login", "/signup"] as const
export const DEFAULT_AUTHENTICATED_REDIRECT = "/dashboard"

export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route)
}

export function isProtectedRoute(pathname: string): boolean {
  if (pathname === "/") {
    return true
  }

  return pathname.startsWith("/dashboard")
}

export function createLoginRedirectPath(pathname: string, search: string): string {
  const destination = `${pathname}${search}`
  const params = new URLSearchParams({ next: destination })
  return `/login?${params.toString()}`
}

export function resolveSignedInRedirect(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_REDIRECT
  }

  return next
}
