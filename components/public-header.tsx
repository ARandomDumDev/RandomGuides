"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, Plus, UserPlus, LogOut, User, Loader2, Crown, Settings } from "lucide-react"
import Link from "next/link"
import { EnhancedSettingsModal } from "./enhanced-settings-modal"
import { useRouter } from "next/navigation"
import { NotificationBadge } from "./notification-badge"

interface PublicHeaderProps {
  authenticatedUser?: string | null
  loading?: boolean
}

export function PublicHeader({ authenticatedUser, loading = false }: PublicHeaderProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      localStorage.removeItem("randomguides-user")
      await fetch("/api/auth/logout", { method: "POST" })
      console.log("Logged out successfully")
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      localStorage.removeItem("randomguides-user")
      window.location.href = "/"
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isOwner = authenticatedUser === "RandomaticPerson"

  return (
    <>
      <header className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 animate-slide-in-left">
            <div className="flex-shrink-0 transform hover:scale-110 transition-transform duration-300">
              <img
                src="/icon.png"
                alt="RandomGuides"
                className="w-12 h-12 object-contain rounded-xl bg-white/20 p-2 shadow-lg backdrop-blur-sm border border-white/30"
              />
            </div>
            <div>
              <Link
                href="/"
                className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition-all duration-300 hover:scale-105 inline-block"
              >
                RandomGuides
              </Link>
              <p className="text-sm text-white/80 animate-fade-in-delay">
                Guides 4 Gen Z{loading && <span className="ml-2 text-white/60 animate-pulse">• Loading...</span>}
                {!loading && authenticatedUser && (
                  <span className="ml-2 text-yellow-300 animate-bounce-subtle">• Hello, {authenticatedUser}! 👋</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 animate-slide-in-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {loading ? (
              <div className="flex items-center gap-2 text-white/60 animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : authenticatedUser ? (
              <>
                <div className="animate-bounce-in">
                  <NotificationBadge />
                </div>
                {isOwner && (
                  <Button
                    variant="outline"
                    className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 border-yellow-300/50 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-glow"
                    asChild
                  >
                    <Link href="/owner">
                      <Crown className="h-4 w-4 mr-2 animate-pulse" />
                      Owner Panel
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  className="bg-white text-fuchsia-600 hover:bg-white/90 border-none transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-subtle"
                  asChild
                >
                  <Link href="/editor">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Guide
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-none transition-all duration-300 hover:scale-105"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-none transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button
                  className="bg-white text-fuchsia-600 hover:bg-white/90 border-none transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  asChild
                >
                  <Link href="/login">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Guide
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <EnhancedSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        isCreator={!!authenticatedUser}
      />
    </>
  )
}

export default PublicHeader
