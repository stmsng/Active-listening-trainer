import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Protected routes require login
  if (pathname.startsWith("/admin") || pathname.startsWith("/clinician")) {
    if (!user) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Admin routes require admin role
  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  // Clinician routes require clinician role
  if (pathname.startsWith("/clinician") && user?.role !== "clinician") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/clinician/:path*"],
};
