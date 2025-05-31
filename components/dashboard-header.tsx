"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Plus, Sparkles, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SettingsModal } from "./settings-modal"
// Import the NotificationBadge component
import { NotificationBadge } from "./notification-badge"

interface DashboardHeaderProps {
  username: string
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      // Clear local storage
      localStorage.removeItem("guides4genz-user")

      // Call logout API to clear server session
      await fetch("/api/auth/logout", { method: "POST" })

      console.log("Logged out successfully")

      // Force a hard redirect to ensure middleware runs
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout error:", error)
      // Even if API fails, clear local storage and redirect
      localStorage.removeItem("guides4genz-user")
      window.location.href = "/login"
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <header className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition-opacity flex items-center"
            >
              <Sparkles className="h-6 w-6 mr-2" />
              <span>RandomGuides</span>
            </Link>
            <p className="text-sm text-white/80">Guides 4 Gen Z • Creator Dashboard • Welcome, {username}</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBadge />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button className="bg-white text-fuchsia-600 hover:bg-white/90 border-none" asChild>
              <Link href="/editor">
                <Plus className="h-4 w-4 mr-2" />
                New Guide
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-none"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} isCreator={true} />
    </>
  )
}
