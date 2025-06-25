export interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontFamily: string
}

export const oceanTheme: ThemeSettings = {
  primaryColor: "#0ea5e9", // sky-500
  secondaryColor: "#06b6d4", // cyan-500
  accentColor: "#8b5cf6", // violet-500
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  borderRadius: "0.75rem",
  fontFamily: "Inter, sans-serif",
}

export const presetThemes = {
  ocean: oceanTheme,
  default: {
    primaryColor: "#8b5cf6", // violet-500
    secondaryColor: "#ec4899", // pink-500
    accentColor: "#06b6d4", // cyan-500
    backgroundColor: "#ffffff",
    textColor: "#1f2937", // gray-800
    borderRadius: "0.75rem",
    fontFamily: "Inter, sans-serif",
  },
  sunset: {
    primaryColor: "#f97316", // orange-500
    secondaryColor: "#ef4444", // red-500
    accentColor: "#eab308", // yellow-500
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0.75rem",
    fontFamily: "Inter, sans-serif",
  },
  forest: {
    primaryColor: "#22c55e", // green-500
    secondaryColor: "#84cc16", // lime-500
    accentColor: "#06b6d4", // cyan-500
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: "0.75rem",
    fontFamily: "Inter, sans-serif",
  },
  dark: {
    primaryColor: "#8b5cf6", // violet-500
    secondaryColor: "#ec4899", // pink-500
    accentColor: "#06b6d4", // cyan-500
    backgroundColor: "#1f2937", // gray-800
    textColor: "#f9fafb", // gray-50
    borderRadius: "0.75rem",
    fontFamily: "Inter, sans-serif",
  },
}

export function applyTheme(theme: ThemeSettings) {
  const root = document.documentElement

  // Apply CSS custom properties
  root.style.setProperty("--primary-color", theme.primaryColor)
  root.style.setProperty("--secondary-color", theme.secondaryColor)
  root.style.setProperty("--accent-color", theme.accentColor)
  root.style.setProperty("--background-color", theme.backgroundColor)
  root.style.setProperty("--text-color", theme.textColor)
  root.style.setProperty("--border-radius", theme.borderRadius)
  root.style.setProperty("--font-family", theme.fontFamily)

  // Apply to Tailwind CSS variables
  root.style.setProperty("--color-primary", theme.primaryColor)
  root.style.setProperty("--color-secondary", theme.secondaryColor)

  // Update body background
  document.body.style.backgroundColor = theme.backgroundColor
  document.body.style.color = theme.textColor
}

export function saveTheme(theme: ThemeSettings) {
  localStorage.setItem("randomguides-theme", JSON.stringify(theme))
  applyTheme(theme)
}

export function loadTheme(): ThemeSettings {
  if (typeof window === "undefined") return oceanTheme

  const saved = localStorage.getItem("randomguides-theme")
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      applyTheme(parsed)
      return parsed
    } catch {
      applyTheme(oceanTheme)
      return oceanTheme
    }
  }

  applyTheme(oceanTheme)
  return oceanTheme
}

export function initializeTheme() {
  if (typeof window !== "undefined") {
    const theme = loadTheme()
    applyTheme(theme)
  }
}
