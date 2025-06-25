import { NextResponse } from "next/server"

import { supabase } from "../../../lib/supabase"

export async function POST(req: Request) {
  try {
    const { message, chatId } = await req.json()

    if (!message || !chatId) {
      return new NextResponse("Missing message or chatId", { status: 400 })
    }

    // Basic validation, you might want to improve this
    if (typeof message !== "string" || message.length === 0) {
      return new NextResponse("Invalid message format", { status: 400 })
    }

    // Insert the message into the Supabase database
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          chat_id: chatId,
          content: message,
          sender_id: "user", // Replace with actual user ID if available
        },
      ])
      .select("*")

    if (error) {
      console.error("Supabase error:", error)
      return new NextResponse("Failed to send message", { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Server error:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
