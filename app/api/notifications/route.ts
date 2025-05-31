import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"

export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) {
      return NextResponse.json({ notifications: [] }, { status: 401 })
    }

    const payload = await decrypt(session)
    if (!payload) {
      return NextResponse.json({ notifications: [] }, { status: 401 })
    }

    // For now, return mock notifications
    // In a real app, you would fetch from the database
    const mockNotifications = [
      {
        id: "1",
        message: "The logo is broken and the admin panel for me is broken and the global chat is broken is it my fault? idk",
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        type: "success",
      },
      {
        id: "2",
        message: "yall i cant control anything the one above me lists everything broken",
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        type: "info",
      },
      {
        id: "3",
        message: "Your account has been approved! You can now create guides.",
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        type: "success",
      },
      {
        id: "4",
        message: "Welcome to RandomGuides! Get started by creating your first guide.",
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        type: "info",
      },
    ]

    return NextResponse.json({ notifications: mockNotifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ notifications: [] }, { status: 500 })
  }
}
