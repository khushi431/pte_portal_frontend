// Must match user_role enum in database exactly
export type UserRole =
    | 'super_admin'
    | 'institute_admin'
    | 'branch_admin'
    | 'teacher'
    | 'student'

// Role → default dashboard path (used after login redirect)
export const ROLE_DASHBOARD: Record<UserRole, string> = {
    super_admin: '/superAdmin/dashboard',
    institute_admin: '/admin/dashboard',
    branch_admin: '/branch-admin/dashboard',
    teacher: '/teacher/dashboard',
    student: '/student/dashboard',
}

// Public platform student dashboard (root domain, logged in)
export const PLATFORM_STUDENT_DASHBOARD = '/platform/student/dashboard'

// Routes that don't require auth
export const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/forgetPassword',
    '/about',
    '/pricing',
]

export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((r) => pathname.startsWith(r))
}

// Marketing routes on root domain (never redirect away)
export const MARKETING_ROUTES = ['/', '/about', '/pricing']

export function isMarketingRoute(pathname: string): boolean {
    return MARKETING_ROUTES.some((r) => pathname === r)
}

export function getDashboardUrl(role: UserRole, tenantId: string | null): string {
    if (role === 'student' && !tenantId) return PLATFORM_STUDENT_DASHBOARD
    return ROLE_DASHBOARD[role] ?? '/login'
}