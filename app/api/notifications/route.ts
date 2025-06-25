import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get("email"))
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  const { error } = await supabase.from("subscribers").insert({ email })

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not subscribe user`, {
      status: 301,
    })
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?message=Check email to confirm subscription!`, {
    status: 301,
  })
}
