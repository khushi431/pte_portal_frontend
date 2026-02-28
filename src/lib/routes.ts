export type UserRole = "superAdmin" | "admin" | "branchAdmin" | "teacher" | "student" | "platform";

export const ROLE_COOKIE = "role";

/** Role → default dashboard URL */
export const ROLE_DASHBOARD: Record<UserRole, string> = {
    superAdmin: "/dashboard",
    admin: "/admin/dashboard",
    branchAdmin: "/branch-admin/dashboard",
    teacher: "/teacher/dashboard",
    student: "/student/dashboard",
    platform: "/platform/student",
};

/** Routes that require auth — everything except (auth) group */
export const PUBLIC_ROUTES = ["/login", "/register", "/forgetPassword"];

/** Given a pathname, return which role prefix it belongs to (for middleware) */
export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
}
