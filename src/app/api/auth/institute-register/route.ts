import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { created, error, serverError } from '@/lib/api'
import { z } from 'zod'

const instituteRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().min(2, 'Full name is required'),
    phone: z.string().optional(),
    invite_token: z.string().min(1, 'Invite token is required'),
})

// POST /api/auth/institute-register
// Called when an invited institute user (admin/teacher/student) sets up their account.
// Flow: institute_admin creates user → system generates invite → user clicks link → lands here

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = instituteRegisterSchema.safeParse(body)
        if (!parsed.success) {
            return error(parsed.error.issues[0].message)
        }

        const { email, password, full_name, phone, invite_token } = parsed.data

        // ── Validate invite token ─────────────────────────────────────────────
        // Admin client bypasses RLS to read invite regardless of auth state
        const adminClient = createAdminClient()
        const { data: invite, error: inviteError } = await adminClient
            .from('user_invites')
            .select('*')
            .eq('token', invite_token)
            .eq('email', email)
            .eq('is_used', false)
            .gt('expires_at', new Date().toISOString())
            .single()

        if (inviteError || !invite) {
            return error('Invalid or expired invite token', 400)
        }

        // ── Create auth user with role metadata from invite ───────────────────
        const supabase = await createServerClient()
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone: phone ?? null,
                    role: invite.role,
                    tenant_id: invite.tenant_id,
                    branch_id: invite.branch_id ?? null,
                },
            },
        })

        if (signUpError) return error(signUpError.message)
        if (!data.user) return error('Signup failed')

        // ── Mark invite as used ───────────────────────────────────────────────
        await adminClient
            .from('user_invites')
            .update({ is_used: true, used_at: new Date().toISOString() })
            .eq('id', invite.id)

        return created({
            message: 'Account created successfully',
            user: {
                id: data.user.id,
                email: data.user.email,
                role: invite.role,
            },
        })
    } catch (e) {
        return serverError(e)
    }
}