import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters long" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Create user
    const user = await createUser(username, email, password)

    console.log("User registered successfully:", { username, email, id: user.id })

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please contact kanedavidpersonal@gmail.com for verification.",
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    if (error.message === "Username or email already exists") {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
