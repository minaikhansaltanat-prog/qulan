import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Coarse gate: bounce unauthenticated requests to /admin/* away from the
// dashboard shell. Every page/action still re-checks role via `auth()` or
// requireRole() server-side — see the note in Next's proxy docs that Proxy
// alone must not be relied on for authorization.
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
