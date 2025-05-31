"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { UserPlus, Mail, CheckCircle } from "lucide-react"

export function RegisterForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }

      setSuccess(true)
      console.log("Registration successful!")
    } catch (err) {
      console.error("Registration error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Registration Successful!
          </CardTitle>
          <CardDescription className="text-white/80">Your account has been created</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Verification Required</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Your account has been created successfully! To start creating guides, please contact:
                  </p>
                  <div className="bg-white rounded border p-3">
                    <p className="font-mono text-sm text-blue-800">kanedavidpersonal@gmail.com</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Include your username and email in your message for faster verification. Mention "RandomGuides" in
                    the subject.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
              >
                Go to Login
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                Browse Public Guides
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg">
        <CardTitle>Create Account</CardTitle>
        <CardDescription className="text-white/80">Join the Guides 4 Gen Z community</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a unique username"
              required
              minLength={3}
              className="border-gray-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
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
              placeholder="Create a secure password"
              required
              minLength={6}
              className="border-gray-200 focus:border-fuchsia-500 focus:ring-fuchsia-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              minLength={6}
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
              "Creating Account..."
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> After registration, you'll need to contact{" "}
              <span className="font-mono">kanedavidpersonal@gmail.com</span> to get your account approved for creating
              guides.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
