import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { created, error, serverError } from '@/lib/api'
import { sendWelcomeEmail } from '@/lib/email'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().min(2, 'Full name is required'),
    phone: z.string().optional(),
})

// POST /api/auth/register — public student signup only
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = registerSchema.safeParse(body)
        if (!parsed.success) return error(parsed.error.issues[0].message)

        const { email, password, full_name, phone } = parsed.data
        const supabase = await createServerClient()

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone: phone ?? null,
                    role: 'student',
                    tenant_id: null,
                    branch_id: null,
                },
            },
        })

        if (signUpError) return error(signUpError.message)
        if (!data.user) return error('Signup failed')

        // Send welcome email if session exists (email confirmation disabled)
        if (data.session) {
            try {
                await sendWelcomeEmail(email, full_name)
            } catch (emailError) {
                console.error('Failed to send welcome email:', emailError)
            }
        }

        return created({
            message: data.session
                ? 'Account created successfully'
                : 'Account created. Please check your email to confirm.',
            user: {
                id: data.user.id,
                email: data.user.email,
            },
        })
    } catch (e) {
        return serverError(e)
    }
}