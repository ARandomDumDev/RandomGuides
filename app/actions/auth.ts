"use server"

import { redirect } from "next/navigation"
import { createSession, deleteSession } from "@/lib/session"
import bcrypt from "bcryptjs"

// Hardcoded encrypted credentials
const VALID_USERNAME = "RandomaticPerson"
const ENCRYPTED_PASSWORD = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXIG/QJOOHvm" // This is "Superidol1" encrypted

export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  // Validate credentials
  if (username !== VALID_USERNAME) {
    return { error: "Invalid credentials" }
  }

  const isValidPassword = await bcrypt.compare(password, ENCRYPTED_PASSWORD)
  if (!isValidPassword) {
    return { error: "Invalid credentials" }
  }

  // Create session
  await createSession(username)
  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
