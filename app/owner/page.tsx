import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { OwnerPanel } from "@/components/owner-panel"

export default async function OwnerPage() {
  // Server-side authentication check
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) {
    redirect("/login")
  }

  const payload = await decrypt(session)
  if (!payload || payload.username !== "RandomaticPerson") {
    redirect("/dashboard") // Redirect non-owners to dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OwnerPanel />
    </div>
  )
}
