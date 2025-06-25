import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase"

// Server-side client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Export for admin operations
export { supabaseServer as adminClient }
export default supabaseServer
