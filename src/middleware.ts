import { NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE, ROLE_DASHBOARD, UserRole, isPublicRoute } from "./lib/routes";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const role = request.cookies.get(ROLE_COOKIE)?.value as UserRole | undefined;

    // Allow Next.js internals and static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const publicRoute = isPublicRoute(pathname);

    // Not logged in + trying to access protected route → redirect to login
    if (!role && !publicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Already logged in + on a public page (e.g. /login) → redirect to dashboard
    if (role && publicRoute) {
        const dashboard = ROLE_DASHBOARD[role] ?? "/login";
        return NextResponse.redirect(new URL(dashboard, request.url));
    }

    // Logged in but accessing "/" → redirect to dashboard
    if (role && pathname === "/") {
        const dashboard = ROLE_DASHBOARD[role] ?? "/login";
        return NextResponse.redirect(new URL(dashboard, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
