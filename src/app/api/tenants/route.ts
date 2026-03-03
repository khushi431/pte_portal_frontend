import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ok, created, error, serverError, requireAuth, requireRole } from '@/lib/api'
import { z } from 'zod'

const createTenantSchema = z.object({
    name: z.string().min(2),
    subdomain: z.string().min(3).regex(/^[a-z0-9][a-z0-9\-]{1,61}[a-z0-9]$/, 'Invalid subdomain format'),
    logo_url: z.string().url().optional(),
    plan_tier: z.enum(['free', 'pro', 'gold', 'platinum']).default('free'),
})

// GET /api/tenants — super_admin only, list all tenants
export async function GET(req: NextRequest) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin'])
        if (roleError) return roleError

        const supabase = await createServerClient()
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') ?? '1')
        const limit = parseInt(searchParams.get('limit') ?? '20')
        const search = searchParams.get('search') ?? ''
        const from = (page - 1) * limit

        let query = supabase
            .from('tenants')
            .select('*, users(count)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, from + limit - 1)

        if (search) query = query.ilike('name', `%${search}%`)

        const { data, error: dbError, count } = await query
        if (dbError) return serverError(dbError)

        return ok({ data, total: count, page, limit })
    } catch (e) {
        return serverError(e)
    }
}

// POST /api/tenants — super_admin only, create new institute
export async function POST(req: NextRequest) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin'])
        if (roleError) return roleError

        const body = await req.json()
        const parsed = createTenantSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const supabase = await createServerClient()

        // Check subdomain uniqueness
        const { data: existing } = await supabase
            .from('tenants')
            .select('id')
            .eq('subdomain', parsed.data.subdomain)
            .single()

        if (existing) return error('Subdomain already taken', 409)

        // Get plan limits to copy into tenant
        const { data: planLimits } = await supabase
            .from('plan_limits')
            .select('max_branches, max_students')
            .eq('tier', parsed.data.plan_tier)
            .single()

        const { data: tenant, error: dbError } = await supabase
            .from('tenants')
            .insert({
                ...parsed.data,
                max_branches: planLimits?.max_branches ?? 1,
                max_students: planLimits?.max_students ?? 50,
            })
            .select()
            .single()

        if (dbError) return serverError(dbError)
        return created(tenant)
    } catch (e) {
        return serverError(e)
    }
}