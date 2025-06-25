// Temporary file to resolve deployment error
// This re-exports from the main supabase file
export { supabase } from "./supabase"
export { supabase as default } from "./supabase"

// Re-export all types
export type {
  User,
  Guide,
  GuideElement,
  Comment,
  Report,
  Notification,
  Banner,
  Database,
  Json,
} from "./supabase"
