import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getUserProfile } from '@/lib/supabase/server'

// ─── Standard response helpers ───────────────────────────────────────────────

export function ok(data: unknown, status = 200) {
    return NextResponse.json(data, { status })
}

export function created(data: unknown) {
    return NextResponse.json(data, { status: 201 })
}

export function noContent() {
    return new NextResponse(null, { status: 204 })
}

export function error(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status })
}

export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export function notFound(resource = 'Resource') {
    return NextResponse.json({ error: `${resource} not found` }, { status: 404 })
}

export function serverError(e: unknown) {
    console.error(e)
    const message = e instanceof Error ? e.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
}

// ─── Auth guard helper ────────────────────────────────────────────────────────
// Use at the top of every protected API route:
//
//   const { user, profile, errorResponse } = await requireAuth()
//   if (errorResponse) return errorResponse
//

export async function requireAuth() {
    const user = await getAuthenticatedUser()
    if (!user) return { user: null, profile: null, errorResponse: unauthorized() }

    const profile = await getUserProfile(user.id)
    if (!profile) return { user: null, profile: null, errorResponse: unauthorized() }

    if (!profile.is_active) {
        return {
            user: null,
            profile: null,
            errorResponse: error('Your account has been deactivated', 403)
        }
    }

    return { user, profile, errorResponse: null }
}

// ─── Role guard helper ────────────────────────────────────────────────────────
// Usage:
//   const roleError = requireRole(profile, ['super_admin', 'institute_admin'])
//   if (roleError) return roleError
//

type UserRole = 'super_admin' | 'institute_admin' | 'branch_admin' | 'teacher' | 'student'

export function requireRole(
    profile: { role: UserRole },
    allowedRoles: UserRole[]
) {
    if (!allowedRoles.includes(profile.role)) return forbidden()
    return null
}