import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/session"
import { authenticateUser } from "@/lib/auth"

// Keep the hardcoded admin account for backwards compatibility
const ADMIN_USERNAME = "RandomaticPerson"
const ADMIN_PASSWORD = "Superidol1"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    console.log("Login attempt:", { username })

    // Check if it's the admin account first (backwards compatibility)
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      await createSession(username)
      console.log("Admin login successful")
      return NextResponse.json({ success: true })
    }

    // Try to authenticate with database
    try {
      const user = await authenticateUser(username, password)
      await createSession(user.username)
      console.log("User login successful:", user.username)
      return NextResponse.json({ success: true })
    } catch (authError: any) {
      console.log("Database auth failed:", authError.message)

      if (authError.message === "Account pending approval") {
        return NextResponse.json(
          {
            error: "Your account is pending approval. Please contact kanedavidpersonal@gmail.com to get verified.",
          },
          { status: 403 },
        )
      }

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
