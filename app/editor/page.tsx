import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { GuideEditor } from "@/components/guide-editor"
import { MobileEditor } from "@/components/mobile-editor"

export default async function EditorPage() {
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
      {/* Show mobile editor on mobile devices, desktop editor on desktop */}
      <div className="block md:hidden">
        <MobileEditor />
      </div>
      <div className="hidden md:block">
        <GuideEditor />
      </div>
    </div>
  )
}
