// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;

    // Public routes
    const publicRoutes = ["/signin", "/api/auth", "/_next", "/favicon.ico"];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Handle authenticated users trying to access signin
    if (pathname === "/signin" && req.auth) {
        return NextResponse.redirect(new URL("/", nextUrl.origin));
    }

    // Redirect unauthenticated users
    if (!req.auth) {
        const signInUrl = new URL("/signin", nextUrl.origin);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};