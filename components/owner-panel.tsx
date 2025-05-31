"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Users, Settings, Ban, Edit, Trash2, Eye, EyeOff, Shield, Activity } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  is_approved: boolean
  is_suspended: boolean
  created_at: string
}

interface Guide {
  id: string
  title: string
  created_by: string
  is_published: boolean
  created_at: string
}

export function OwnerPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [systemSettings, setSystemSettings] = useState({
    guidesEnabled: true,
    editorEnabled: true,
    chatEnabled: true,
    registrationEnabled: true,
  })
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "This feature is temporarily under maintenance. Please try again later.",
  )

  useEffect(() => {
    fetchUsers()
    fetchGuides()
    fetchSystemSettings()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchGuides = async () => {
    try {
      const response = await fetch("/api/admin/guides")
      if (response.ok) {
        const data = await response.json()
        setGuides(data.guides || [])
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
    }
  }

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSystemSettings(data.settings || systemSettings)
      }
    } catch (error) {
      console.error("Error fetching system settings:", error)
    }
  }

  const updateUserStatus = async (userId: string, action: "approve" | "suspend" | "unsuspend" | "ban") => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, { method: "POST" })
      if (response.ok) {
        fetchUsers()
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error)
    }
  }

  const updateGuideStatus = async (guideId: string, action: "publish" | "unpublish" | "delete") => {
    try {
      const response = await fetch(`/api/admin/guides/${guideId}/${action}`, { method: "POST" })
      if (response.ok) {
        fetchGuides()
      }
    } catch (error) {
      console.error(`Error ${action} guide:`, error)
    }
  }

  const updateSystemSettings = async (newSettings: typeof systemSettings) => {
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: newSettings }),
      })
      if (response.ok) {
        setSystemSettings(newSettings)
      }
    } catch (error) {
      console.error("Error updating system settings:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Owner Panel</h1>
          <p className="text-gray-600">Administrative controls for RandomGuides</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, approvals, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{user.username}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.is_approved ? "default" : "secondary"}>
                          {user.is_approved ? "Approved" : "Pending"}
                        </Badge>
                        {user.is_suspended && <Badge variant="destructive">Suspended</Badge>}
                        <div className="flex gap-1">
                          {!user.is_approved && (
                            <Button
                              size="sm"
                              onClick={() => updateUserStatus(user.id, "approve")}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserStatus(user.id, user.is_suspended ? "unsuspend" : "suspend")}
                          >
                            {user.is_suspended ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => updateUserStatus(user.id, "ban")}>
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle>Guide Management</CardTitle>
              <CardDescription>Manage all guides, edit content, and control visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {guides.map((guide) => (
                    <div key={guide.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{guide.title}</h3>
                        <p className="text-sm text-gray-600">By {guide.created_by}</p>
                        <p className="text-xs text-gray-500">
                          Created {new Date(guide.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={guide.is_published ? "default" : "secondary"}>
                          {guide.is_published ? "Published" : "Draft"}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" asChild>
                            <a href={`/editor?id=${guide.id}`}>
                              <Edit className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateGuideStatus(guide.id, guide.is_published ? "unpublish" : "publish")}
                          >
                            {guide.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => updateGuideStatus(guide.id, "delete")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Controls</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Guide Creation</h3>
                    <p className="text-sm text-gray-600">Allow users to create new guides</p>
                  </div>
                  <Switch
                    checked={systemSettings.guidesEnabled}
                    onCheckedChange={(checked) => updateSystemSettings({ ...systemSettings, guidesEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Guide Editor</h3>
                    <p className="text-sm text-gray-600">Allow access to the guide editor</p>
                  </div>
                  <Switch
                    checked={systemSettings.editorEnabled}
                    onCheckedChange={(checked) => updateSystemSettings({ ...systemSettings, editorEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Global Chat</h3>
                    <p className="text-sm text-gray-600">Enable the global chat feature</p>
                  </div>
                  <Switch
                    checked={systemSettings.chatEnabled}
                    onCheckedChange={(checked) => updateSystemSettings({ ...systemSettings, chatEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User Registration</h3>
                    <p className="text-sm text-gray-600">Allow new user registrations</p>
                  </div>
                  <Switch
                    checked={systemSettings.registrationEnabled}
                    onCheckedChange={(checked) =>
                      updateSystemSettings({ ...systemSettings, registrationEnabled: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Message</CardTitle>
                <CardDescription>Customize the message shown when features are disabled</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Enter maintenance message..."
                  className="min-h-20"
                />
                <Button
                  className="mt-2"
                  onClick={() => {
                    localStorage.setItem("maintenance-message", maintenanceMessage)
                  }}
                >
                  Save Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">{users.filter((u) => u.is_approved).length} approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Guides</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{guides.length}</div>
                <p className="text-xs text-muted-foreground">{guides.filter((g) => g.is_published).length} published</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Features</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.values(systemSettings).filter(Boolean).length}/4</div>
                <p className="text-xs text-muted-foreground">Features enabled</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
