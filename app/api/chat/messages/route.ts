import { NextResponse } from "next/server"

import { supabase } from "../../../lib/supabase"

export async function POST(request: Request) {
  try {
    const { message, chatId, userId } = await request.json()

    if (!message || !chatId || !userId) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          content: message,
          chat_id: chatId,
          user_id: userId,
        },
      ])
      .select("*")

    if (error) {
      console.error("Error inserting message:", error)
      return new NextResponse("Error inserting message", { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("[MESSAGES_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
