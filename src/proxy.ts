import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  const { pathname } = request.nextUrl;

  const allowedPaths = ["/maintenance", "/favicon.ico"];

  const isAllowed =
    allowedPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api");

  if (maintenance && !isAllowed) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};