import { createClient } from "@supabase/supabase-js"

// Server-side Supabase configuration with service role keys
const primarySupabaseUrl = process.env.NEXT_PUBLIC_PRIMARY_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const primarySupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const fallbackSupabaseUrl = process.env.NEXT_PUBLIC_FALLBACK_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const fallbackSupabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create server clients with service role keys
const primaryServerClient = createClient(primarySupabaseUrl, primarySupabaseServiceKey)
const fallbackServerClient = createClient(fallbackSupabaseUrl, fallbackSupabaseServiceKey)

let currentServerClient = primaryServerClient
let usingFallback = false

// Health check function for server
async function checkPrimaryServerHealth(): Promise<boolean> {
  try {
    const { data, error } = await primaryServerClient.from("guides").select("id").limit(1)
    return !error
  } catch {
    return false
  }
}

// Server-side smart client
export const supabaseServer = {
  async from(table: string) {
    if (!usingFallback) {
      const isHealthy = await checkPrimaryServerHealth()
      if (!isHealthy) {
        console.log("Primary Supabase unavailable, switching to fallback")
        currentServerClient = fallbackServerClient
        usingFallback = true
      }
    }
    return currentServerClient.from(table)
  },

  async auth() {
    return currentServerClient.auth
  },

  async storage() {
    return currentServerClient.storage
  },

  async tryPrimary() {
    if (usingFallback) {
      const isHealthy = await checkPrimaryServerHealth()
      if (isHealthy) {
        console.log("Primary Supabase back online, switching back")
        currentServerClient = primaryServerClient
        usingFallback = false
      }
    }
  },

  getCurrentServer() {
    return usingFallback ? "fallback" : "primary"
  },
}

// Server-side client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// For server-side operations that need admin privileges
export async function getServerSupabase() {
  return supabaseAdmin
}

export type User = {
  id: string
  username: string
  email: string
  password_hash: string
  is_verified: boolean
  is_approved: boolean
  is_moderator: boolean
  created_at: string
  updated_at: string
  profile_picture?: string
  bio?: string
  badges?: string[]
  flair?: string
}

export type Guide = {
  id: string
  title: string
  description: string | null
  created_at: string
  updated_at: string
  created_by: string
  user_id: string | null
  is_published: boolean
  category?: string
  tags?: string[]
  likes_count: number
  saves_count: number
  shares_count: number
  version: number
}

export type GuideElement = {
  id: string
  guide_id: string
  type: "text" | "image" | "rectangle" | "circle" | "triangle" | "video" | "link" | "website"
  content: string
  x: number
  y: number
  width: number | null
  height: number | null
  font_size: number | null
  color: string | null
  background_color: string | null
  border_color: string | null
  border_width: number | null
  rotation: number | null
  layer: number | null
  href: string | null
  created_at: string
}

export type Comment = {
  id: string
  guide_id: string
  user_id: string
  username: string
  content: string
  created_at: string
  updated_at: string
}

export type Report = {
  id: string
  reporter_id: string
  reported_type: "guide" | "user" | "comment"
  reported_id: string
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  type: "welcome" | "report" | "like" | "comment" | "system"
  title: string
  message: string
  read: boolean
  created_at: string
}

export type Banner = {
  id: string
  message: string
  type: "info" | "warning" | "error" | "success"
  active: boolean
  created_at: string
}
