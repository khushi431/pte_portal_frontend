import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ok, created, error, serverError, requireAuth, requireRole } from '@/lib/api'
import { sendInviteEmail } from '@/lib/email'
import { z } from 'zod'

const inviteStudentSchema = z.object({
    email: z.string().email(),
    full_name: z.string().min(2),
    branch_id: z.string().uuid().optional(),
})

type Params = { params: Promise<{ id: string }> }

// GET /api/tenants/[id]/students
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin', 'institute_admin', 'branch_admin', 'teacher'])
        if (roleError) return roleError

        const { id } = await params
        if (profile!.role !== 'super_admin' && profile!.tenant_id !== id) {
            return error('Forbidden', 403)
        }

        const supabase = await createServerClient()
        const { searchParams } = new URL(req.url)
        const branchId = searchParams.get('branch_id')

        let query = supabase
            .from('users')
            .select('id, email, full_name, phone, branch_id, is_active, created_at, branches(name)')
            .eq('tenant_id', id)
            .eq('role', 'student')
            .order('created_at', { ascending: false })

        if (profile!.role === 'branch_admin' || profile!.role === 'teacher') {
            query = query.eq('branch_id', profile!.branch_id!)
        } else if (branchId) {
            query = query.eq('branch_id', branchId)
        }

        const { data, error: dbError } = await query
        if (dbError) return serverError(dbError)
        return ok(data)
    } catch (e) {
        return serverError(e)
    }
}

// POST /api/tenants/[id]/students — invite a student
export async function POST(req: NextRequest, { params }: Params) {
    try {
        const { profile, errorResponse } = await requireAuth()
        if (errorResponse) return errorResponse
        const roleError = requireRole(profile!, ['super_admin', 'institute_admin', 'branch_admin'])
        if (roleError) return roleError

        const { id } = await params
        if (profile!.role !== 'super_admin' && profile!.tenant_id !== id) {
            return error('Forbidden', 403)
        }

        const body = await req.json()
        const parsed = inviteStudentSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const supabase = await createServerClient()

        // Check student limit
        const { data: tenant } = await supabase
            .from('tenants')
            .select('name, max_students')
            .eq('id', id)
            .single()

        const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', id)
            .eq('role', 'student')
            .eq('is_active', true)

        if (tenant && count !== null && count >= tenant.max_students) {
            return error(`Student limit reached for your plan (max: ${tenant.max_students})`, 403)
        }

        const adminClient = createAdminClient()

        // Check no existing active invite
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
                branch_id: parsed.data.branch_id ?? profile!.branch_id ?? null,
                email: parsed.data.email,
                role: 'student',
                created_by: profile!.id,
            })
            .select()
            .single()

        if (inviteError) return serverError(inviteError)

        // Send invite email
        try {
            await sendInviteEmail({
                to: parsed.data.email,
                full_name: parsed.data.full_name,
                role: 'student',
                tenant_name: tenant?.name ?? 'Your Institute',
                invite_token: invite.token,
                expires_at: invite.expires_at,
            })
        } catch (emailError) {
            console.error('Failed to send invite email:', emailError)
            // Don't fail the request — invite is created, email can be resent
        }

        return created({ message: 'Invite sent successfully' })
    } catch (e) {
        return serverError(e)
    }
}