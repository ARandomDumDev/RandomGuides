import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deploymentId = searchParams.get("deploymentId")

    if (!deploymentId) {
      return NextResponse.json({ error: "Missing deploymentId parameter" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("deployment_logs")
      .select("*")
      .eq("deployment_id", deploymentId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch deployment logs" }, { status: 500 })
    }

    return NextResponse.json({ logs: data }, { status: 200 })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
