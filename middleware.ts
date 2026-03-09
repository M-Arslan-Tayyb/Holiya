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
    role: token?.role,
  });

  const authPages = ["/login", "/register", "/signup"];
  const isAuthPage = authPages.includes(pathname);

  // const adminRoutes = ["/admin-dashboard", "/user-listing"];
  // const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route + "/"));

  // Not authenticated and trying to access protected routes
  if (!token && !isAuthPage) {
    console.log("❌ [Middleware] No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Profile incomplete logic
  if (token && token.userProfileCompletion === false) {
    if (pathname === "/register") {
      return NextResponse.next();
    }
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/register", req.url));
    }
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // Authenticated and on login page → redirect based on role
  if (token && pathname === "/login") {
    if (token.role === 1) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Authenticated and on register page → redirect based on role
  if (token && pathname === "/register" && token.userProfileCompletion === true) {
    if (token.role === 1) {
      return NextResponse.redirect(new URL("/admin-dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Role-based protection: Admin only routes
  // if (isAdminRoute && token?.role !== 1) {
  //   console.log("🚫 [Middleware] Unauthorized access to admin route, redirecting to /unauthorized");
  //   return NextResponse.redirect(new URL("/unauthorized", req.url));
  // }

  // Prevent admin from accessing normal dashboard if requested, 
  // but usually admin can access everything. 
  // The user said: "if the role is admin then we have to show this routes and not the current normal dashboard."
  // This sounds like a default redirect, but usually admin can still visit it.
  // Let's implement the redirect from /dashboard to /admin-dashboard for admins to satisfy "not the current normal dashboard".
  if (pathname === "/dashboard" && token?.role === 1) {
    return NextResponse.redirect(new URL("/admin-dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
