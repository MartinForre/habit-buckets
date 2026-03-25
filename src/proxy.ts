import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  DEFAULT_AUTHENTICATED_REDIRECT,
  createLoginRedirectPath,
  isAuthRoute,
  isProtectedRoute,
} from "@/lib/auth/guards"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl
  const { response, user } = await updateSession(request)

  if (!user && isProtectedRoute(pathname)) {
    const loginPath = createLoginRedirectPath(pathname, search)
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  if (user && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_AUTHENTICATED_REDIRECT, request.url))
  }

  return response
}

export default proxy

export const config = {
  matcher: ["/", "/dashboard/:path*", "/history", "/login", "/signup"],
}
