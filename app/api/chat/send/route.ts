import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"

// Mock storage (use database in production)
let chatMessages: any[] = []

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const payload = await decrypt(session)
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Add message
    const newMessage = {
      id: `msg-${Date.now()}`,
      username: payload.username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isOwner: payload.username === "RandomaticPerson",
    }

    chatMessages.push(newMessage)

    // Keep only last 50 messages
    if (chatMessages.length > 50) {
      chatMessages = chatMessages.slice(-50)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
