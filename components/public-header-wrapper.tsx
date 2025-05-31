"use client"

import { useState, useEffect } from "react"
import { PublicHeader } from "./public-header"

export function PublicHeaderWrapper() {
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // First check local storage for quick feedback
      const storedUser = localStorage.getItem("randomguides-user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData.authenticated && userData.username) {
            setAuthenticatedUser(userData.username)
          }
        } catch (error) {
          console.error("Error parsing stored user:", error)
          localStorage.removeItem("randomguides-user")
        }
      }

      // Then verify with server
      const response = await fetch("/api/auth/check")
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setAuthenticatedUser(data.username)
          // Update local storage with fresh data
          localStorage.setItem(
            "randomguides-user",
            JSON.stringify({
              username: data.username,
              authenticated: true,
              loginTime: new Date().toISOString(),
            }),
          )
        } else {
          setAuthenticatedUser(null)
          localStorage.removeItem("randomguides-user")
        }
      } else {
        setAuthenticatedUser(null)
        localStorage.removeItem("randomguides-user")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setAuthenticatedUser(null)
    } finally {
      setLoading(false)
    }
  }

  return <PublicHeader authenticatedUser={authenticatedUser} loading={loading} />
}
