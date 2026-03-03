import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ok, error, noContent, serverError, requireAuth, requireRole } from '@/lib/api'
import { z } from 'zod'

const updateTenantSchema = z.object({
    name: z.string().min(2).optional(),
    logo_url: z.string().url().nullable().optional(),
    plan_tier: z.enum(['free', 'pro', 'gold', 'platinum']).optional(),
    is_active: z.boolean().optional(),
    plan_expires_at: z.string().datetime().nullable().optional(),
})

type Params = { params: Promise<{ id: string }> }

// GET /api/tenants/[id]
export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse

        const { id } = await params

        // super_admin can get any tenant
        // institute_admin can only get their own
        const roleError = requireRole(profile!, ['super_admin', 'institute_admin'])
        if (roleError) return roleError

        if (profile!.role === 'institute_admin' && profile!.tenant_id !== id) {
            return error('Forbidden', 403)
        }

        const supabase = await createServerClient()
        const { data, error: dbError } = await supabase
            .from('tenants')
            .select(`
        *,
        branches(id, name, location, is_active),
        users(count)
      `)
            .eq('id', id)
            .single()

        if (dbError || !data) return error('Tenant not found', 404)
        return ok(data)
    } catch (e) {
        return serverError(e)
    }
}

// PATCH /api/tenants/[id] — super_admin only
export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin'])
        if (roleError) return roleError

        const { id } = await params
        const body = await req.json()
        const parsed = updateTenantSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const supabase = await createServerClient()
        const { data, error: dbError } = await supabase
            .from('tenants')
            .update(parsed.data)
            .eq('id', id)
            .select()
            .single()

        if (dbError) return serverError(dbError)
        if (!data) return error('Tenant not found', 404)
        return ok(data)
    } catch (e) {
        return serverError(e)
    }
}

// DELETE /api/tenants/[id] — super_admin only (soft delete via is_active)
export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin'])
        if (roleError) return roleError

        const { id } = await params
        const supabase = await createServerClient()

        const { error: dbError } = await supabase
            .from('tenants')
            .update({ is_active: false })
            .eq('id', id)

        if (dbError) return serverError(dbError)
        return noContent()
    } catch (e) {
        return serverError(e)
    }
}