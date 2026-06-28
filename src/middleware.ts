import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_VALUE,
} from "@/lib/adminAuthCookie";

const LOGIN_PATH = "/login";

function isAdminRoute(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function middleware(request: NextRequest) {
  if (!isAdminRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(ADMIN_AUTH_COOKIE);

  if (authCookie?.value === ADMIN_AUTH_COOKIE_VALUE) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
