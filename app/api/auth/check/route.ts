import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return NextResponse.json({ user: session.user })
  }

  return NextResponse.json({ user: null })
}
