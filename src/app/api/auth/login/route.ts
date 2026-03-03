import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ok, error, serverError } from '@/lib/api'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
})

// POST /api/auth/login
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = loginSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const { email, password } = parsed.data
        const supabase = await createServerClient()

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) return error(signInError.message, 401)
        if (!data.user) return error('Login failed', 401)

        // Fetch profile to return role + tenant for frontend redirect logic
        const { data: profile } = await supabase
            .from('users')
            .select('role, tenant_id, full_name')
            .eq('id', data.user.id)
            .single()

        return ok({
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: profile?.full_name ?? null,
                role: profile?.role ?? null,
                tenant_id: profile?.tenant_id ?? null,
            },
        })
    } catch (e) {
        return serverError(e)
    }
}