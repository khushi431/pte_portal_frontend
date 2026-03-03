import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import {
    isPublicRoute,
    isMarketingRoute,
    ROLE_DASHBOARD,
    PLATFORM_STUDENT_DASHBOARD,
    UserRole,
} from '@/lib/routes'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
const SUPER_ADMIN_SUBDOMAIN = 'admin'

export async function middleware(req: NextRequest) {
    const hostname = req.headers.get('host') || ''
    const { pathname } = req.nextUrl

    const hostnameWithoutPort = hostname.split(':')[0]
    const rootWithoutPort = ROOT_DOMAIN.split(':')[0]

    const isRootDomain =
        hostnameWithoutPort === rootWithoutPort ||
        hostnameWithoutPort === `www.${rootWithoutPort}`

    const subdomain = hostnameWithoutPort.replace(`.${rootWithoutPort}`, '')
    const isSubdomain = !isRootDomain && subdomain !== hostnameWithoutPort

    // ── Always refresh Supabase auth session ─────────────────────────────────
    let supabaseResponse = NextResponse.next({ request: req })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request: req })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // ── 1. Root domain ────────────────────────────────────────────────────────
    if (isRootDomain) {
        // Always allow marketing pages
        if (isMarketingRoute(pathname)) return supabaseResponse

        // Allow public auth routes
        if (isPublicRoute(pathname)) {
            // Already logged in — redirect to correct dashboard
            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('role, tenant_id')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    // Public platform student
                    if (profile.role === 'student' && !profile.tenant_id) {
                        return NextResponse.redirect(new URL(PLATFORM_STUDENT_DASHBOARD, req.url))
                    }
                    // Super admin
                    if (profile.role === 'super_admin') {
                        return NextResponse.redirect(new URL(ROLE_DASHBOARD['super_admin'], req.url))
                    }
                }
            }
            return supabaseResponse
        }

        // Protect /platform and /superAdmin routes
        if (pathname.startsWith('/platform') || pathname.startsWith('/superAdmin')) {
            if (!user) {
                return NextResponse.redirect(new URL('/login', req.url))
            }
        }

        return supabaseResponse
    }

    // ── 2. admin.yourplatform.com — super admin panel ────────────────────────
    if (isSubdomain && subdomain === SUPER_ADMIN_SUBDOMAIN) {
        if (!user && !isPublicRoute(pathname)) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        return supabaseResponse
    }

    // ── 3. institute.yourplatform.com — tenant subdomain ─────────────────────
    if (isSubdomain) {
        const { data: tenant } = await supabase
            .from('tenants')
            .select('id, name, plan_tier, is_active, plan_expires_at')
            .eq('subdomain', subdomain)
            .single()

        if (!tenant) {
            return NextResponse.redirect(new URL('/', `https://${ROOT_DOMAIN}`))
        }

        if (!tenant.is_active) {
            return NextResponse.redirect(new URL('/deactivated', `https://${ROOT_DOMAIN}`))
        }

        if (tenant.plan_expires_at && new Date(tenant.plan_expires_at) < new Date()) {
            return NextResponse.redirect(new URL('/plan-expired', `https://${ROOT_DOMAIN}`))
        }

        // Protect all non-login routes
        if (!isPublicRoute(pathname) && !user) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // After login, redirect to role-appropriate dashboard
        if (user && isPublicRoute(pathname)) {
            const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role) {
                const dashboard = ROLE_DASHBOARD[profile.role as UserRole]
                if (dashboard) return NextResponse.redirect(new URL(dashboard, req.url))
            }
        }

        // Inject tenant context for layouts and API routes
        supabaseResponse.headers.set('x-tenant-id', tenant.id)
        supabaseResponse.headers.set('x-tenant-name', tenant.name)
        supabaseResponse.headers.set('x-tenant-plan', tenant.plan_tier)

        return supabaseResponse
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}