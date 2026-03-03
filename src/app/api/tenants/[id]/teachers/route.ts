import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ok, created, error, serverError, requireAuth, requireRole } from '@/lib/api'
import { sendInviteEmail } from '@/lib/email'
import { z } from 'zod'

const inviteTeacherSchema = z.object({
    email: z.string().email(),
    full_name: z.string().min(2),
    branch_id: z.string().uuid().optional(),
    role: z.enum(['teacher', 'branch_admin']).default('teacher'),
})

type Params = { params: Promise<{ id: string }> }

// GET /api/tenants/[id]/teachers
export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin', 'institute_admin', 'branch_admin'])
        if (roleError) return roleError

        const { id } = await params
        if (profile!.role !== 'super_admin' && profile!.tenant_id !== id) {
            return error('Forbidden', 403)
        }

        const supabase = await createServerClient()

        let query = supabase
            .from('users')
            .select('id, email, full_name, role, branch_id, is_active, created_at, branches(name)')
            .eq('tenant_id', id)
            .in('role', ['teacher', 'branch_admin', 'institute_admin'])
            .order('created_at', { ascending: false })

        if (profile!.role === 'branch_admin') {
            query = query.eq('branch_id', profile!.branch_id!)
        }

        const { data, error: dbError } = await query
        if (dbError) return serverError(dbError)
        return ok(data)
    } catch (e) {
        return serverError(e)
    }
}

// POST /api/tenants/[id]/teachers — invite a teacher or branch_admin
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
        const parsed = inviteTeacherSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const supabase = await createServerClient()
        const { data: tenant } = await supabase
            .from('tenants')
            .select('name')
            .eq('id', id)
            .single()

        const adminClient = createAdminClient()

        const { data: existingInvite } = await adminClient
            .from('user_invites')
            .select('id')
            .eq('email', parsed.data.email)
            .eq('tenant_id', id)
            .eq('is_used', false)
            .gt('expires_at', new Date().toISOString())
            .single()

        if (existingInvite) return error('An active invite already exists for this email', 409)

        const { data: invite, error: inviteError } = await adminClient
            .from('user_invites')
            .insert({
                tenant_id: id,
                branch_id: parsed.data.branch_id ?? null,
                email: parsed.data.email,
                role: parsed.data.role,
                created_by: profile!.id,
            })
            .select()
            .single()

        if (inviteError) return serverError(inviteError)

        try {
            await sendInviteEmail({
                to: parsed.data.email,
                full_name: parsed.data.full_name,
                role: parsed.data.role,
                tenant_name: tenant?.name ?? 'Your Institute',
                invite_token: invite.token,
                expires_at: invite.expires_at,
            })
        } catch (emailError) {
            console.error('Failed to send invite email:', emailError)
        }

        return created({ message: 'Invite sent successfully' })
    } catch (e) {
        return serverError(e)
    }
}