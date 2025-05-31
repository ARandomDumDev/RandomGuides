import bcrypt from "bcryptjs"
import { supabase } from "./supabase"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(username: string, email: string, password: string) {
  // Check if username or email already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .or(`username.eq.${username},email.eq.${email}`)
    .single()

  if (existingUser) {
    throw new Error("Username or email already exists")
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user
  const { data: user, error } = await supabase
    .from("users")
    .insert({
      username,
      email,
      password_hash: passwordHash,
      is_verified: false,
      is_approved: false,
    })
    .select()
    .single()

  if (error) throw error

  return user
}

export async function authenticateUser(username: string, password: string) {
  // Get user by username
  const { data: user, error } = await supabase.from("users").select("*").eq("username", username).single()

  if (error || !user) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  // Check if user is approved
  if (!user.is_approved) {
    throw new Error("Account pending approval")
  }

  return user
}
