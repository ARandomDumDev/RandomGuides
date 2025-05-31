export interface AuthUser {
  username: string
  authenticated: boolean
  loginTime?: string
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("randomguides-user")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("Error reading stored user:", error)
    localStorage.removeItem("guides4genz-user")
  }

  return null
}

export function clearStoredUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("randomguides-user")
  }
}

export async function verifySession(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/check")
    return response.ok
  } catch (error) {
    console.error("Session verification error:", error)
    return false
  }
}
