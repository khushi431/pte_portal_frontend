import { createServerClient } from '@/lib/supabase/server'
import { UserRole, ROLE_DASHBOARD, PLATFORM_STUDENT_DASHBOARD } from './routes'

export type { UserRole }

// Get full user profile (role + tenant) — use in server components and API routes
export async function getUserProfile() {
    const supabase = await createServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('users')
        .select('*, tenants(id, name, subdomain, plan_tier, is_active, plan_expires_at)')
        .eq('id', user.id)
        .single()

    return profile ?? null
}

// Get just the role — lightweight, use when you only need role check
export async function getRole(): Promise<UserRole | null> {
    const supabase = await createServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    return (data?.role as UserRole) ?? null
}

// Get redirect path after login based on role + tenant context
export function getDashboardUrl(role: UserRole, tenantId: string | null): string {
    if (role === 'student' && !tenantId) return PLATFORM_STUDENT_DASHBOARD
    return ROLE_DASHBOARD[role] ?? '/login'
}