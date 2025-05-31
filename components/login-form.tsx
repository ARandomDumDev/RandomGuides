"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        setLoading(false)
        return
      }

      // Save user data to local storage for client-side persistence
      const userData = {
        username: formData.get("username") as string,
        authenticated: true,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("randomguides-user", JSON.stringify(userData))

      console.log("Login successful! Redirecting to dashboard...")

      // Force a hard redirect to ensure middleware runs
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
          <CardTitle>Creator Access</CardTitle>
          <CardDescription className="text-white/80">Sign in to create and manage guides</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
                className="border-gray-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="border-gray-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-gray-200 shadow-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Don't have an account yet?</p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Create New Account
              </Link>
            </Button>
            <p className="text-xs text-gray-500">New accounts require approval to create guides</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
