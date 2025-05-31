import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { DashboardHeader } from "@/components/dashboard-header"
import { GuidesList } from "@/components/guides-list"

export default async function DashboardPage() {
  // Server-side authentication check
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) {
    redirect("/login")
  }

  const payload = await decrypt(session)
  if (!payload) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={payload.username} />
      <main className="container mx-auto px-4 py-8">
        <GuidesList />
      </main>
    </div>
  )
}
