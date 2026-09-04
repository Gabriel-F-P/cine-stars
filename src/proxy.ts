import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (!session?.user) {
    const loginUrl = new URL("/entrar", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/conta", req.nextUrl.origin));
  }

  if (
    pathname.startsWith("/funcionario") &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "FUNCIONARIO"
  ) {
    return NextResponse.redirect(new URL("/conta", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/conta/:path*", "/admin/:path*", "/funcionario/:path*"],
};
