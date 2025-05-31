import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/session"
import { LoginForm } from "@/components/login-form"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default async function LoginPage() {
  // Redirect if already authenticated
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (session) {
    const payload = await decrypt(session)
    if (payload) {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-fuchsia-600 mr-2" />
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
              Guides 4 Gen Z
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Creator Login</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-fuchsia-600 hover:text-fuchsia-700">
            ← Back to public guides
          </Link>
        </div>
      </div>
    </div>
  )
}
