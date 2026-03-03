import { createServerClient } from '@/lib/supabase/server'
import { ok, serverError } from '@/lib/api'

// POST /api/auth/logout
export async function POST() {
    try {
        const supabase = await createServerClient()
        await supabase.auth.signOut()
        return ok({ message: 'Logged out successfully' })
    } catch (e) {
        return serverError(e)
    }
}