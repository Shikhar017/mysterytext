import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const token = req.auth;
  const url = req.nextUrl;

  if (token && (
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify")
  )) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/", "/sign-up", "/sign-in", "/dashboard/:path*", "/verify/:path*"]
};