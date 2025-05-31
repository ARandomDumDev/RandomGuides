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
import { X, Palette, Code, Monitor, Download, RefreshCw, History, Sparkles, Zap, Users, Shield } from "lucide-react"
import { type ThemeSettings, defaultTheme, presetThemes, saveTheme, loadTheme, applyTheme } from "@/lib/settings"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  isCreator?: boolean
}

const changelog = [
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
  {
    version: "2.0.0",
    date: "2024-01-10",
    type: "major",
    changes: [
      "🔒 Added comprehensive authentication system",
      "🛡️ Implemented middleware-based route protection",
      "💾 Added local storage for login persistence",
      "🔐 Server-side session management with JWT",
      "🚪 Protected dashboard and editor routes",
      "✅ Automatic redirect handling for auth states",
    ],
  },
  {
    version: "1.9.0",
    date: "2024-01-08",
    type: "feature",
    changes: [
      "🔍 Added advanced search functionality",
      "📝 Search through guide titles, descriptions, and content",
      "🎯 Improved element selection and control system",
      "🎮 Added drag and scale controls directly on elements",
      "🔧 Fixed editor page movement and interaction issues",
      "⚡ Enhanced performance and responsiveness",
    ],
  },
  {
    version: "1.8.0",
    date: "2024-01-05",
    type: "feature",
    changes: [
      "🎨 Added shapes support (rectangles, circles, triangles)",
      "🖼️ Enhanced image handling and display",
      "📐 Improved element positioning and scaling",
      "🎯 Better element selection and editing",
      "🔧 Fixed various editor bugs and improvements",
      "💾 Updated database schema for new element types",
    ],
  },
  {
    version: "1.7.0",
    date: "2024-01-03",
    type: "feature",
    changes: [
      "🚀 Added real deployment integration with Vercel API",
      "📊 Live deployment logs and status monitoring",
      "📝 Enhanced guide editor with drag-and-drop",
      "🔄 Improved draft and publish workflow",
      "⚙️ Better settings modal with developer tools",
      "🎨 Enhanced UI/UX across the platform",
    ],
  },
  {
    version: "1.6.0",
    date: "2024-01-01",
    type: "feature",
    changes: [
      "🎨 Complete theme customization system",
      "🎭 Multiple preset themes (Ocean, Sunset, Forest, Dark)",
      "🖌️ Custom color picker for all theme elements",
      "📱 Responsive design improvements",
      "⚡ Performance optimizations",
      "🔧 Bug fixes and stability improvements",
    ],
  },
  {
    version: "1.5.0",
    date: "2023-12-28",
    type: "feature",
    changes: [
      "📝 Advanced guide editor with visual elements",
      "🖼️ Image upload and management",
      "📐 Element positioning and resizing",
      "💾 Auto-save functionality",
      "🎯 Improved user experience",
      "🔍 Better guide discovery",
    ],
  },
  {
    version: "1.4.0",
    date: "2023-12-25",
    type: "feature",
    changes: [
      "🎄 Holiday UI updates",
      "📊 Dashboard improvements",
      "🔐 Enhanced security measures",
      "📱 Mobile responsiveness",
      "🎨 UI polish and refinements",
    ],
  },
  {
    version: "1.3.0",
    date: "2023-12-20",
    type: "feature",
    changes: [
      "🗂️ Guide categorization system",
      "🔍 Search and filter functionality",
      "📈 Analytics and insights",
      "🎨 Theme system foundation",
      "⚡ Performance improvements",
    ],
  },
  {
    version: "1.2.0",
    date: "2023-12-15",
    type: "feature",
    changes: [
      "📝 Rich text editor for guides",
      "🖼️ Media support (images, videos)",
      "📱 Mobile-first responsive design",
      "🎯 Improved navigation",
      "🔧 Bug fixes and optimizations",
    ],
  },
  {
    version: "1.1.0",
    date: "2023-12-10",
    type: "feature",
    changes: [
      "👤 User authentication system",
      "📊 Creator dashboard",
      "📝 Guide creation and editing",
      "🎨 Initial theme support",
      "🔒 Basic security implementation",
    ],
  },
  {
    version: "1.0.0",
    date: "2023-12-01",
    type: "major",
    changes: [
      "🎉 Initial release of RandomGuides",
      "📚 Basic guide viewing functionality",
      "🎨 Gen Z-inspired design system",
      "📱 Responsive layout",
      "🚀 Core platform foundation",
    ],
  },
]

export function SettingsModal({ isOpen, onClose, isCreator = false }: SettingsModalProps) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [logs, setLogs] = useState<string[]>([])
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([])
  const [loadingDeploymentLogs, setLoadingDeploymentLogs] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTheme(loadTheme())

      // Capture console logs if creator
      if (isCreator) {
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

        // Load real deployment logs
        fetchDeploymentLogs()

        return () => {
          console.log = originalLog
          console.error = originalError
          console.warn = originalWarn
        }
      }
    }
  }, [isOpen, isCreator])

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
    onClose()
  }

  const handleReset = () => {
    setTheme(defaultTheme)
    applyTheme(defaultTheme)
  }

  const exportLogs = () => {
    const allLogs = [...logs, ...deploymentLogs].join("\n")
    const blob = new Blob([allLogs], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `guides4genz-logs-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "major":
        return <Sparkles className="h-4 w-4 text-yellow-500" />
      case "feature":
        return <Zap className="h-4 w-4 text-blue-500" />
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return <History className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeTypeBadge = (type: string) => {
    const variants = {
      major: "bg-yellow-100 text-yellow-800 border-yellow-300",
      feature: "bg-blue-100 text-blue-800 border-blue-300",
      security: "bg-red-100 text-red-800 border-red-300",
      bugfix: "bg-green-100 text-green-800 border-green-300",
    }
    return variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
          <h2 className="text-2xl font-bold">Settings</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="changelog" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Changelog
              </TabsTrigger>
              {isCreator && (
                <TabsTrigger value="dev" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Developer
                </TabsTrigger>
              )}
            </TabsList>

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
                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="accentColor"
                          type="color"
                          value={theme.accentColor}
                          onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={theme.accentColor}
                          onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                          placeholder="#06b6d4"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={theme.backgroundColor}
                          onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={theme.backgroundColor}
                          onChange={(e) => handleThemeChange("backgroundColor", e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Customize fonts and styling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <Select value={theme.fontFamily} onValueChange={(value) => handleThemeChange("fontFamily", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                        <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                        <SelectItem value="Poppins, sans-serif">Poppins</SelectItem>
                        <SelectItem value="Montserrat, sans-serif">Montserrat</SelectItem>
                        <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="borderRadius">Border Radius</Label>
                    <Select
                      value={theme.borderRadius}
                      onValueChange={(value) => handleThemeChange("borderRadius", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0rem">None</SelectItem>
                        <SelectItem value="0.25rem">Small</SelectItem>
                        <SelectItem value="0.5rem">Medium</SelectItem>
                        <SelectItem value="0.75rem">Large</SelectItem>
                        <SelectItem value="1rem">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>General preferences and configurations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Version</Label>
                      <p className="text-sm text-gray-600">RandomGuides v2.1.0</p>
                    </div>
                    <Badge variant="outline">Latest</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Environment</Label>
                      <p className="text-sm text-gray-600">Production</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Last Updated</Label>
                      <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Registration</Label>
                      <p className="text-sm text-gray-600">Email verification required</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Users className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
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
                              {getChangeTypeIcon(release.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">v{release.version}</h3>
                                <Badge className={getChangeTypeBadge(release.type)}>{release.type}</Badge>
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

            {isCreator && (
              <TabsContent value="dev" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Developer Tools
                    </CardTitle>
                    <CardDescription>Debug information and logs for developers</CardDescription>
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
                      <Button
                        onClick={fetchDeploymentLogs}
                        variant="outline"
                        size="sm"
                        disabled={loadingDeploymentLogs}
                      >
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
            )}
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
