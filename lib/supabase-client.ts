import { createClient } from "@supabase/supabase-js"

// Client-side Supabase configuration (only public keys)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create client-side client with anon key only
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Simple client for public operations
export const supabase = supabaseClient
