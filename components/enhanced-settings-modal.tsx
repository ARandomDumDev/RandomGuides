"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { X, Palette, Code, Monitor, Download, RefreshCw, History, Sparkles, Globe } from "lucide-react"
import { type ThemeSettings, defaultTheme, presetThemes, saveTheme, loadTheme, applyTheme } from "@/lib/settings"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  isCreator?: boolean
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
]

const changelog = [
  {
    version: "3.0.0",
    date: "2024-01-20",
    type: "major",
    changes: [
      "🎉 Added PWA support - Install as app on mobile devices",
      "📱 Complete mobile-friendly editor with tabs and touch controls",
      "🎨 Major editor UI overhaul with modern tabbed interface",
      "🎬 Added video support in guides",
      "🔗 Added hyperlink support with clickable links",
      "📄 Added multi-layer support for complex layouts",
      "💬 Added global chat with hourly message clearing",
      "🌍 Added Google Translate integration in settings",
      "👑 Added owner panel for RandomaticPerson with admin controls",
      "📊 Added working share, save, like functionality with counters",
      "💬 Added comments system for guides",
      "🔧 Made dev tools available to all users",
      "🚫 Added maintenance mode controls for owner",
      "📱 Responsive design improvements for mobile devices",
      "🔔 Added notification system with badge counts",
      "⚙️ Made all settings actually functional",
      "🎯 Improved text scaling and element positioning",
      "🎨 Added new logo and branding",
    ],
  },
  {
    version: "2.1.0",
    date: "2024-01-15",
    type: "major",
    changes: [
      "🎉 Added user registration system with email verification",
      "🔐 Implemented account approval workflow",
      "👥 New users can now create accounts and request access",
      "📧 Contact kanedavidpersonal@gmail.com for account verification",
      "🛡️ Enhanced security with password hashing and validation",
      "📊 Updated database schema to support user accounts",
    ],
  },
  // ... previous changelog entries
]

export function EnhancedSettingsModal({ isOpen, onClose, isCreator = false }: SettingsModalProps) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [language, setLanguage] = useState("en")
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const [loadingDeploymentLogs, setLoadingDeploymentLogs] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTheme(loadTheme())
      loadSettings()

      // Capture console logs
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn

      console.log = (...args) => {
        setLogs((prev) => [...prev.slice(-49), `[LOG] ${new Date().toLocaleTimeString()}: ${args.join(" ")}`])
        originalLog(...args)
      }

      console.error = (...args) => {
        setLogs((prev) => [...prev.slice(-49), `[ERROR] ${new Date().toLocaleTimeString()}: ${args.join(" ")}`])
        originalError(...args)
      }

      console.warn = (...args) => {
        setLogs((prev) => [...prev.slice(-49), `[WARN] ${new Date().toLocaleTimeString()}: ${args.join(" ")}`])
        originalWarn(...args)
      }

      fetchDeploymentLogs()

      return () => {
        console.log = originalLog
        console.error = originalError
        console.warn = originalWarn
      }
    }
  }, [isOpen])

  const loadSettings = () => {
    const savedLanguage = localStorage.getItem("randomguides-language") || "en"
    const savedAutoTranslate = localStorage.getItem("randomguides-auto-translate") === "true"
    const savedNotifications = localStorage.getItem("randomguides-notifications") !== "false"
    const savedDarkMode = localStorage.getItem("randomguides-dark-mode") === "true"

    setLanguage(savedLanguage)
    setAutoTranslate(savedAutoTranslate)
    setNotifications(savedNotifications)
    setDarkMode(savedDarkMode)

    // Apply dark mode
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const saveSettings = () => {
    localStorage.setItem("randomguides-language", language)
    localStorage.setItem("randomguides-auto-translate", autoTranslate.toString())
    localStorage.setItem("randomguides-notifications", notifications.toString())
    localStorage.setItem("randomguides-dark-mode", darkMode.toString())

    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Initialize Google Translate if enabled
    if (autoTranslate && language !== "en") {
      initializeGoogleTranslate()
    }
  }

  const initializeGoogleTranslate = () => {
    // Add Google Translate script
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script")
      script.id = "google-translate-script"
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      document.head.appendChild(script)

      // Initialize Google Translate
      ;(window as any).googleTranslateElementInit = () => {
        ;new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: languages.map((l) => l.code).join(","),
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element",
        )
      }
    }
  }

  const fetchDeploymentLogs = async () => {
    try {
      setLoadingDeploymentLogs(true)
      const response = await fetch("/api/deployment/logs")
      const data = await response.json()
      setDeploymentLogs(data.logs || [])
    } catch (error) {
      console.error("Failed to fetch deployment logs:", error)
      setDeploymentLogs([
        `[ERROR] ${new Date().toISOString()} - Failed to fetch deployment logs`,
        `[ERROR] ${new Date().toISOString()} - ${error}`,
      ])
    } finally {
      setLoadingDeploymentLogs(false)
    }
  }

  const handleThemeChange = (key: keyof ThemeSettings, value: string) => {
    const newTheme = { ...theme, [key]: value }
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const handlePresetSelect = (presetName: string) => {
    const preset = presetThemes[presetName as keyof typeof presetThemes]
    setTheme(preset)
    applyTheme(preset)
  }

  const handleSave = () => {
    saveTheme(theme)
    saveSettings()
    onClose()
  }

  const handleReset = () => {
    setTheme(defaultTheme)
    applyTheme(defaultTheme)
    setLanguage("en")
    setAutoTranslate(false)
    setNotifications(true)
    setDarkMode(false)
  }

  const exportLogs = () => {
    const allLogs = [...logs, ...deploymentLogs].join("\n")
    const blob = new Blob([allLogs], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `randomguides-logs-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="RandomGuides" className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language
              </TabsTrigger>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="changelog" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Changelog
              </TabsTrigger>
              <TabsTrigger value="dev" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Developer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>Configure your RandomGuides experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications</Label>
                      <p className="text-sm text-gray-600">Receive app notifications</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Version</Label>
                      <p className="text-sm text-gray-600">RandomGuides v3.0.0</p>
                    </div>
                    <Badge variant="outline">Latest</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>PWA Support</Label>
                      <p className="text-sm text-gray-600">Install as app on mobile</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Google Translate Element */}
              <div id="google_translate_element" className="mt-4"></div>
            </TabsContent>

            <TabsContent value="language" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language & Translation</CardTitle>
                  <CardDescription>Configure language preferences and translation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Interface Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Translate Content</Label>
                      <p className="text-sm text-gray-600">Automatically translate guides to your language</p>
                    </div>
                    <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Translation powered by Google</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      When enabled, content will be automatically translated using Google Translate. Translation quality
                      may vary and some technical terms might not translate perfectly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="theme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Presets</CardTitle>
                  <CardDescription>Choose from our curated color schemes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(presetThemes).map(([name, preset]) => (
                      <button
                        key={name}
                        onClick={() => handlePresetSelect(name)}
                        className="p-3 rounded-lg border-2 hover:border-gray-400 transition-colors"
                        style={{
                          background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                        }}
                      >
                        <div className="text-white font-medium capitalize text-sm">{name}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custom Colors</CardTitle>
                  <CardDescription>Customize your own color scheme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={theme.primaryColor}
                          onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={theme.primaryColor}
                          onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={theme.secondaryColor}
                          onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={theme.secondaryColor}
                          onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                          placeholder="#ec4899"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changelog" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Version History
                  </CardTitle>
                  <CardDescription>Track all updates and improvements to RandomGuides</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full">
                    <div className="space-y-6">
                      {changelog.map((release, index) => (
                        <div key={release.version} className="relative">
                          {index !== changelog.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200" />
                          )}
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">v{release.version}</h3>
                                <Badge className="bg-fuchsia-100 text-fuchsia-800">{release.type}</Badge>
                                <span className="text-sm text-gray-500">{release.date}</span>
                              </div>
                              <ul className="space-y-1">
                                {release.changes.map((change, changeIndex) => (
                                  <li key={changeIndex} className="text-sm text-gray-700 leading-relaxed">
                                    {change}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dev" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Developer Tools
                  </CardTitle>
                  <CardDescription>Debug information and logs (Available to all users)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={exportLogs} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                    <Button onClick={() => setLogs([])} variant="outline" size="sm">
                      Clear Console
                    </Button>
                    <Button onClick={fetchDeploymentLogs} variant="outline" size="sm" disabled={loadingDeploymentLogs}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${loadingDeploymentLogs ? "animate-spin" : ""}`} />
                      Refresh Deployments
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Console Logs</CardTitle>
                  <CardDescription>Real-time application logs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-60 overflow-y-auto">
                    {logs.length === 0 ? (
                      <div className="text-gray-500">No logs yet... Interact with the app to see logs here.</div>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="mb-1">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Deployment Logs</span>
                    {loadingDeploymentLogs && <RefreshCw className="h-4 w-4 animate-spin" />}
                  </CardTitle>
                  <CardDescription>Real deployment information from Vercel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm max-h-60 overflow-y-auto">
                    {deploymentLogs.map((log, index) => (
                      <div key={index} className="mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
