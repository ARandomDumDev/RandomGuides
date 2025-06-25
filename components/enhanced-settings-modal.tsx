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
import { X, Palette, Monitor, History, Sparkles, Globe, Bell, Moon, Sun, Volume2, Save, RotateCcw } from "lucide-react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  isCreator?: boolean
}

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

const defaultTheme: ThemeSettings = {
  primaryColor: "#0ea5e9",
  secondaryColor: "#06b6d4",
  accentColor: "#8b5cf6",
}

const presetThemes = {
  ocean: { primaryColor: "#0ea5e9", secondaryColor: "#06b6d4", accentColor: "#0891b2" },
  sunset: { primaryColor: "#f97316", secondaryColor: "#ef4444", accentColor: "#dc2626" },
  forest: { primaryColor: "#059669", secondaryColor: "#10b981", accentColor: "#047857" },
  purple: { primaryColor: "#8b5cf6", secondaryColor: "#a855f7", accentColor: "#7c3aed" },
  pink: { primaryColor: "#ec4899", secondaryColor: "#f472b6", accentColor: "#db2777" },
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
]

const changelog = [
  {
    version: "3.3.0",
    date: "2025-06-25",
    type: "major",
    changes: [
      "✨ Added beautiful animations throughout the entire site",
      "🎨 Fixed logo sizing - now properly sized and more prominent",
      "⚙️ Completely rebuilt settings system - all settings now work perfectly",
      "🔧 Removed developer tab for non-developers",
      "🎭 Added hover animations and transitions to all interactive elements",
      "🌊 Enhanced theme system with better color application",
      "💫 Added fade-in, slide-in, and bounce animations",
      "🎯 Improved button hover effects with scale and glow animations",
      "🌟 Added subtle pulse animations for important elements",
      "🎨 Enhanced visual feedback for all user interactions",
      "💾 Fixed settings persistence across browser sessions",
      "🎪 Added rotation animations for settings icon",
      "🌈 Improved gradient animations and transitions",
    ],
  },
  {
    version: "3.2.0",
    date: "2025-06-25",
    type: "major",
    changes: [
      "🎨 Fixed squished logo and proper icon sizing throughout the app",
      "⚙️ Replaced incorrect settings icon with proper Settings icon",
      "🌊 Set Ocean theme as the default theme for all new users",
      "🔧 Made all settings actually functional and persistent",
      "🗂️ Added guide categories and tagging system",
      "📝 Added comprehensive comments system for guides",
      "👤 Added user profile pages with customizable avatars",
      "🏆 Added badges and flairs system for user recognition",
      "📊 Added version history for guides with restore functionality",
      "🚨 Added report system for content moderation",
      "👮 Added moderator role system with special permissions",
      "🌙 Added full dark mode support with system preference detection",
      "📱 Fixed mobile editor support and responsiveness",
      "💾 Added guide download for offline viewing",
      "🌐 Added website embedding support in guides",
      "🔔 Enhanced notification system with real-time updates",
      "🎯 Added 404 page with interactive ping pong game",
      "🔐 Added password reset functionality with Supabase",
      "📊 Enhanced owner panel with real-time analytics",
      "🎨 Fixed theme system to actually apply changes",
      "🌍 Added Google Translate integration",
      "📱 Added PWA support for mobile installation",
      "💬 Enhanced global chat with better moderation",
      "🔒 Fixed user permissions and guide editing restrictions",
      "💾 Fixed guide saving system to properly save all elements",
      "🎮 Removed buggy random guide feature",
      "📈 Added real-time updates across all components",
      "🎨 Complete UI overhaul for better user experience",
    ],
  },
]

export function EnhancedSettingsModal({ isOpen, onClose, isCreator = false }: SettingsModalProps) {
  // Settings state
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [language, setLanguage] = useState("en")
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [autoSave, setAutoSave] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Load settings on modal open
  useEffect(() => {
    if (isOpen) {
      loadAllSettings()
    }
  }, [isOpen])

  const loadAllSettings = () => {
    try {
      // Load theme
      const savedTheme = localStorage.getItem("randomguides-theme")
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme)
        setTheme(parsedTheme)
        applyTheme(parsedTheme)
      }

      // Load other settings
      setLanguage(localStorage.getItem("randomguides-language") || "en")
      setAutoTranslate(localStorage.getItem("randomguides-auto-translate") === "true")
      setNotifications(localStorage.getItem("randomguides-notifications") !== "false")
      setDarkMode(localStorage.getItem("randomguides-dark-mode") === "true")
      setFontSize(Number.parseInt(localStorage.getItem("randomguides-font-size") || "16"))
      setAutoSave(localStorage.getItem("randomguides-auto-save") !== "false")
      setSoundEffects(localStorage.getItem("randomguides-sound-effects") !== "false")
      setAnimationsEnabled(localStorage.getItem("randomguides-animations") !== "false")

      // Apply settings immediately
      applyDarkMode(localStorage.getItem("randomguides-dark-mode") === "true")
      applyFontSize(Number.parseInt(localStorage.getItem("randomguides-font-size") || "16"))
      applyAnimations(localStorage.getItem("randomguides-animations") !== "false")
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const saveAllSettings = () => {
    try {
      // Save theme
      localStorage.setItem("randomguides-theme", JSON.stringify(theme))
      applyTheme(theme)

      // Save other settings
      localStorage.setItem("randomguides-language", language)
      localStorage.setItem("randomguides-auto-translate", autoTranslate.toString())
      localStorage.setItem("randomguides-notifications", notifications.toString())
      localStorage.setItem("randomguides-dark-mode", darkMode.toString())
      localStorage.setItem("randomguides-font-size", fontSize.toString())
      localStorage.setItem("randomguides-auto-save", autoSave.toString())
      localStorage.setItem("randomguides-sound-effects", soundEffects.toString())
      localStorage.setItem("randomguides-animations", animationsEnabled.toString())

      // Apply settings immediately
      applyDarkMode(darkMode)
      applyFontSize(fontSize)
      applyAnimations(animationsEnabled)

      if (autoTranslate && language !== "en") {
        initializeGoogleTranslate()
      }

      console.log("All settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const applyTheme = (themeSettings: ThemeSettings) => {
    const root = document.documentElement
    root.style.setProperty("--primary-color", themeSettings.primaryColor)
    root.style.setProperty("--secondary-color", themeSettings.secondaryColor)
    root.style.setProperty("--accent-color", themeSettings.accentColor)
  }

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      document.body.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.body.classList.remove("dark")
    }
  }

  const applyFontSize = (size: number) => {
    document.documentElement.style.setProperty("--base-font-size", `${size}px`)
    document.body.style.fontSize = `${size}px`
  }

  const applyAnimations = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.remove("no-animations")
    } else {
      document.documentElement.classList.add("no-animations")
    }
  }

  const initializeGoogleTranslate = () => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script")
      script.id = "google-translate-script"
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      document.head.appendChild(script)
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
    saveAllSettings()
    onClose()
  }

  const handleReset = () => {
    // Reset all settings to defaults
    setTheme(defaultTheme)
    setLanguage("en")
    setAutoTranslate(false)
    setNotifications(true)
    setDarkMode(false)
    setFontSize(16)
    setAutoSave(true)
    setSoundEffects(true)
    setAnimationsEnabled(true)

    // Clear localStorage
    localStorage.removeItem("randomguides-theme")
    localStorage.removeItem("randomguides-language")
    localStorage.removeItem("randomguides-auto-translate")
    localStorage.removeItem("randomguides-notifications")
    localStorage.removeItem("randomguides-dark-mode")
    localStorage.removeItem("randomguides-font-size")
    localStorage.removeItem("randomguides-auto-save")
    localStorage.removeItem("randomguides-sound-effects")
    localStorage.removeItem("randomguides-animations")

    // Apply defaults
    applyTheme(defaultTheme)
    applyDarkMode(false)
    applyFontSize(16)
    applyAnimations(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
          <div className="flex items-center gap-3 animate-slide-in-left">
            <img src="/icon.png" alt="RandomGuides" className="w-10 h-10 rounded-lg bg-white/20 p-2" />
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-90"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 animate-fade-in-delay">
              <TabsTrigger
                value="general"
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Monitor className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="language"
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Globe className="h-4 w-4" />
                Language
              </TabsTrigger>
              <TabsTrigger
                value="changelog"
                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <History className="h-4 w-4" />
                Changelog
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Application Settings
                  </CardTitle>
                  <CardDescription>Configure your RandomGuides experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label className="font-medium">Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive app notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      className="transition-all duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <Save className="h-5 w-5 text-green-500" />
                      <div>
                        <Label className="font-medium">Auto-save</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatically save your work</p>
                      </div>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} className="transition-all duration-300" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label className="font-medium">Sound Effects</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds for interactions</p>
                      </div>
                    </div>
                    <Switch
                      checked={soundEffects}
                      onCheckedChange={setSoundEffects}
                      className="transition-all duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-pink-500" />
                      <div>
                        <Label className="font-medium">Animations</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Enable smooth animations</p>
                      </div>
                    </div>
                    <Switch
                      checked={animationsEnabled}
                      onCheckedChange={setAnimationsEnabled}
                      className="transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Label className="font-medium flex items-center gap-2">
                      Font Size
                      <span className="text-sm text-gray-500">({fontSize}px)</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="range"
                        min="12"
                        max="24"
                        value={fontSize}
                        onChange={(e) => {
                          const newSize = Number.parseInt(e.target.value)
                          setFontSize(newSize)
                          applyFontSize(newSize)
                        }}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12 text-center">{fontSize}px</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    Dark Mode
                  </CardTitle>
                  <CardDescription>Toggle between light and dark themes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <Label>Dark Mode</Label>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={(checked) => {
                        setDarkMode(checked)
                        applyDarkMode(checked)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg">
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
                        className="p-4 rounded-lg border-2 hover:border-gray-400 transition-all duration-300 hover:scale-105 hover:shadow-lg"
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

              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Custom Colors</CardTitle>
                  <CardDescription>Customize your own color scheme</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={theme.primaryColor}
                          onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                          className="w-16 h-10 p-1 transition-all duration-300 hover:scale-105"
                        />
                        <Input
                          value={theme.primaryColor}
                          onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                          placeholder="#0ea5e9"
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
                          className="w-16 h-10 p-1 transition-all duration-300 hover:scale-105"
                        />
                        <Input
                          value={theme.secondaryColor}
                          onChange={(e) => handleThemeChange("secondaryColor", e.target.value)}
                          placeholder="#06b6d4"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="accentColor"
                          type="color"
                          value={theme.accentColor}
                          onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                          className="w-16 h-10 p-1 transition-all duration-300 hover:scale-105"
                        />
                        <Input
                          value={theme.accentColor}
                          onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="language" className="space-y-6 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Language & Translation</CardTitle>
                  <CardDescription>Configure language preferences and translation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Interface Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="mt-1 transition-all duration-300 hover:scale-105">
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
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <Label>Auto-Translate Content</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically translate guides to your language
                      </p>
                    </div>
                    <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
                  </div>
                  <div id="google_translate_element" className="mt-4"></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changelog" className="space-y-6 animate-fade-in">
              <Card className="transition-all duration-300 hover:shadow-lg">
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
                        <div
                          key={release.version}
                          className="relative animate-slide-in-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {index !== changelog.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                          )}
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center animate-pulse-subtle">
                              <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">v{release.version}</h3>
                                <Badge className="bg-fuchsia-100 text-fuchsia-800 animate-bounce-subtle">
                                  {release.type}
                                </Badge>
                                <span className="text-sm text-gray-500">{release.date}</span>
                              </div>
                              <ul className="space-y-1">
                                {release.changes.map((change, changeIndex) => (
                                  <li
                                    key={changeIndex}
                                    className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed transition-all duration-300 hover:text-gray-900 dark:hover:text-gray-100"
                                  >
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
          </Tabs>

          <div className="flex justify-between pt-6 border-t animate-fade-in-delay">
            <Button
              variant="outline"
              onClick={handleReset}
              className="transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:border-red-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="transition-all duration-300 hover:scale-105">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-subtle"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
