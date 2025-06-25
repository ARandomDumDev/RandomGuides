import { createClient } from "@supabase/supabase-js"

// Use the standard environment variables that are safe for client-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export as default for backward compatibility
export default supabase

// Export types for convenience
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      guides: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string
          created_at: string
          updated_at: string
          created_by: string
          user_id: string | null
          is_published: boolean
          category: string | null
          tags: string[] | null
          likes_count: number
          saves_count: number
          shares_count: number
          version: number
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content: string
          created_at?: string
          updated_at?: string
          created_by: string
          user_id?: string | null
          is_published?: boolean
          category?: string | null
          tags?: string[] | null
          likes_count?: number
          saves_count?: number
          shares_count?: number
          version?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string
          created_at?: string
          updated_at?: string
          created_by?: string
          user_id?: string | null
          is_published?: boolean
          category?: string | null
          tags?: string[] | null
          likes_count?: number
          saves_count?: number
          shares_count?: number
          version?: number
        }
      }
      users: {
        Row: {
          id: string
          username: string
          email: string
          password_hash: string
          is_verified: boolean
          is_approved: boolean
          is_moderator: boolean
          created_at: string
          updated_at: string
          profile_picture: string | null
          bio: string | null
          badges: string[] | null
          flair: string | null
        }
        Insert: {
          id?: string
          username: string
          email: string
          password_hash: string
          is_verified?: boolean
          is_approved?: boolean
          is_moderator?: boolean
          created_at?: string
          updated_at?: string
          profile_picture?: string | null
          bio?: string | null
          badges?: string[] | null
          flair?: string | null
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password_hash?: string
          is_verified?: boolean
          is_approved?: boolean
          is_moderator?: boolean
          created_at?: string
          updated_at?: string
          profile_picture?: string | null
          bio?: string | null
          badges?: string[] | null
          flair?: string | null
        }
      }
      guide_elements: {
        Row: {
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
        Insert: {
          id?: string
          guide_id: string
          type: "text" | "image" | "rectangle" | "circle" | "triangle" | "video" | "link" | "website"
          content: string
          x: number
          y: number
          width?: number | null
          height?: number | null
          font_size?: number | null
          color?: string | null
          background_color?: string | null
          border_color?: string | null
          border_width?: number | null
          rotation?: number | null
          layer?: number | null
          href?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          type?: "text" | "image" | "rectangle" | "circle" | "triangle" | "video" | "link" | "website"
          content?: string
          x?: number
          y?: number
          width?: number | null
          height?: number | null
          font_size?: number | null
          color?: string | null
          background_color?: string | null
          border_color?: string | null
          border_width?: number | null
          rotation?: number | null
          layer?: number | null
          href?: string | null
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          guide_id: string
          user_id: string
          username: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guide_id: string
          user_id: string
          username: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          user_id?: string
          username?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_type: "guide" | "user" | "comment"
          reported_id: string
          reason: string
          description: string
          status: "pending" | "resolved" | "dismissed"
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_type: "guide" | "user" | "comment"
          reported_id: string
          reason: string
          description: string
          status?: "pending" | "resolved" | "dismissed"
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_type?: "guide" | "user" | "comment"
          reported_id?: string
          reason?: string
          description?: string
          status?: "pending" | "resolved" | "dismissed"
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: "welcome" | "report" | "like" | "comment" | "system"
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "welcome" | "report" | "like" | "comment" | "system"
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "welcome" | "report" | "like" | "comment" | "system"
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      banners: {
        Row: {
          id: string
          message: string
          type: "info" | "warning" | "error" | "success"
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          message: string
          type: "info" | "warning" | "error" | "success"
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          message?: string
          type?: "info" | "warning" | "error" | "success"
          active?: boolean
          created_at?: string
        }
      }
    }
  }
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
  content: string
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
