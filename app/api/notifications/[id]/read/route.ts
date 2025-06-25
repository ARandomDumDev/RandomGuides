import { NextResponse } from "next/server"
import { supabase } from "../../../../lib/supabase"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return new NextResponse("Notification ID is required", { status: 400 })
    }

    const { data, error } = await supabase.from("notifications").update({ isRead: true }).eq("id", id)

    if (error) {
      console.error("Error updating notification:", error)
      return new NextResponse("Internal Server Error", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in PUT request:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
