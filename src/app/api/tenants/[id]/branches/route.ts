import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ok, created, error, serverError, requireAuth, requireRole } from '@/lib/api'
import { z } from 'zod'

const createBranchSchema = z.object({
    name: z.string().min(2),
    location: z.string().optional(),
})

type Params = { params: Promise<{ id: string }> }

// GET /api/tenants/[id]/branches
export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin', 'institute_admin', 'branch_admin'])
        if (roleError) return roleError

        const { id } = await params

        // institute roles can only access their own tenant
        if (profile!.role !== 'super_admin' && profile!.tenant_id !== id) {
            return error('Forbidden', 403)
        }

        const supabase = await createServerClient()
        const { data, error: dbError } = await supabase
            .from('branches')
            .select('*, users(count)')
            .eq('tenant_id', id)
            .order('created_at', { ascending: true })

        if (dbError) return serverError(dbError)
        return ok(data)
    } catch (e) {
        return serverError(e)
    }
}

// POST /api/tenants/[id]/branches
export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin', 'institute_admin'])
        if (roleError) return roleError

        const { id } = await params

        if (profile!.role !== 'super_admin' && profile!.tenant_id !== id) {
            return error('Forbidden', 403)
        }

        const body = await req.json()
        const parsed = createBranchSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const supabase = await createServerClient()

        // Check branch limit — DB trigger also enforces this but we give a clean error
        const { data: tenant } = await supabase
            .from('tenants')
            .select('max_branches')
            .eq('id', id)
            .single()

        const { count } = await supabase
            .from('branches')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', id)
            .eq('is_active', true)

        if (tenant && count !== null && count >= tenant.max_branches) {
            return error(`Branch limit reached for your plan (max: ${tenant.max_branches})`, 403)
        }

        const { data, error: dbError } = await supabase
            .from('branches')
            .insert({ ...parsed.data, tenant_id: id })
            .select()
            .single()

        if (dbError) {
            // Unique constraint: duplicate branch name
            if (dbError.code === '23505') return error('Branch name already exists', 409)
            return serverError(dbError)
        }

        return created(data)
    } catch (e) {
        return serverError(e)
    }
}