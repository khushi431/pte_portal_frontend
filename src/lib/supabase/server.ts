import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

export async function createServerClient() {
    const cookieStore = await cookies()

    return createSupabaseServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Called from a Server Component — can be ignored
                        // if middleware is refreshing sessions
                    }
                },
            },
        }
    )
}

// Helper: get the current authenticated user or throw 401
export async function getAuthenticatedUser() {
    const supabase = await createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
}

// Helper: get full user profile from public.users table
export async function getUserProfile(userId: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
        .from('users')
        .select('*, tenants(id, name, subdomain, plan_tier, is_active, plan_expires_at)')
        .eq('id', userId)
        .single()

    if (error) return null
    return data
}