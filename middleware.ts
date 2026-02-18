import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("🔒 [Middleware] Path:", pathname);
  console.log("🔒 [Middleware] Token:", {
    hasToken: !!token,
    userProfileCompletion: token?.userProfileCompletion,
    userEmail: token?.userEmail,
  });

  // Include /signup as an auth page
  const authPages = ["/login", "/register", "/signup"];
  const isAuthPage = authPages.includes(pathname);

  // Not authenticated and trying to access protected routes
  if (!token && !isAuthPage) {
    console.log("❌ [Middleware] No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ===== NEW: Check if profile is incomplete - restrict access to home =====
  if (token && token.userProfileCompletion === false) {
    // Profile incomplete - only allow /register, block everything else
    if (pathname === "/register") {
      console.log("✅ [Middleware] Profile incomplete, allowing /register");
      return NextResponse.next();
    }

    // If on login, redirect to register
    if (pathname === "/login") {
      console.log("⚠️ [Middleware] Profile incomplete, login → /register");
      return NextResponse.redirect(new URL("/register", req.url));
    }

    console.log(
      "⚠️ [Middleware] Profile incomplete, blocking",
      pathname,
      "→ /register",
    );
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // ===== Profile is complete or no token - handle normal flows =====

  // Authenticated and on login page → go home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Authenticated and on register page → go home (profile complete)
  if (
    token &&
    pathname === "/register" &&
    token.userProfileCompletion === true
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
