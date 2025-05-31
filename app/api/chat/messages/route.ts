import { NextResponse } from "next/server"

// Mock chat messages storage (in production, use a database)
let chatMessages: any[] = []
const chatDisabled = false

export async function GET() {
  try {
    // In production, fetch from database
    return NextResponse.json({
      messages: chatMessages,
      disabled: chatDisabled,
    })
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json({ messages: [], disabled: false }, { status: 500 })
  }
}

// Clear messages every hour (in production, use a cron job)
setInterval(
  () => {
    chatMessages = []
    console.log("Chat messages cleared")
  },
  60 * 60 * 1000,
) // 1 hour
