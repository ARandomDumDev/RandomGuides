import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  username: string
  email: string
  password_hash: string
  is_verified: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
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
}

export type GuideElement = {
  id: string
  guide_id: string
  type: "text" | "image" | "rectangle" | "circle" | "triangle"
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
  created_at: string
}
