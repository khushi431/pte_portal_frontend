import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// WARNING: This client bypasses ALL Row Level Security.
// Use ONLY in:
//   - Webhook handlers (api/webhooks/)
//   - Server-side admin operations that need to cross tenant boundaries
// NEVER expose this to the client or use in regular API routes.

export function createAdminClient() {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
    }

    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
}