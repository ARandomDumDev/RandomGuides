"use client"

import type React from "react"

import { useEffect } from "react"
import { loadTheme, applyTheme } from "@/lib/settings"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = loadTheme()
    applyTheme(theme)
  }, [])

  return <>{children}</>
}
