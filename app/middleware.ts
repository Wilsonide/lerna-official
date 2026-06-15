import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/student",
  "/teacher",
  "/parent",
  "/admin",
  "/super-admin",
  "/school-admin",
  "/complete-profile",
];

const authPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refresh_token")?.value;

  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthPage = authPages.some((route) => pathname.startsWith(route));

  // =====================================
  // NOT LOGGED IN
  // =====================================
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // =====================================
  // ALREADY LOGGED IN
  // Prevent visiting login/register pages
  // =====================================
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/parent/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
    "/school-admin/:path*",
    "/complete-profile/:path*",

    "/login",
    "/register",
    "/forgot-password",
    "/reset-password/:path*",
  ],
};
