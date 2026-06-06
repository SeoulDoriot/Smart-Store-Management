import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin route protection middleware.
 *
 * Any request to /admin/* (except /admin/login) is redirected to /admin/login
 * when the `lumiere-admin-session` cookie is missing.
 *
 * When Supabase Auth is wired up the cookie is set alongside the Supabase
 * session so this single check covers both mock and real auth.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate /admin routes (skip the login page itself and static assets)
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const session = request.cookies.get("lumiere-admin-session");

  if (!session?.value) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    // Preserve the original destination so we can redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
