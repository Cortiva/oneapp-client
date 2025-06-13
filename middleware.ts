import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes
const protectedRoutes = [
  "/",
  "/dashboard",
  "/employees",
  "/devices",
  "/users",
  "/profile",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "forgotPassword";

  // If path is protected and no token, redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and accessing auth page, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Enable middleware for these paths
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/employees/:path*",
    "/devices/:path*",
    "/users/:path*",
  ],
};
