"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Type,
  ImageIcon,
  Eye,
  Trash2,
  Square,
  Circle,
  Triangle,
  Video,
  Layers,
  Palette,
  Settings,
  Save,
  Share2,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface GuideElement {
  id: string
  type: "text" | "image" | "rectangle" | "circle" | "triangle" | "video" | "link"
  content: string
  x: number
  y: number
  width: number
  height: number
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  rotation?: number
  layer?: number
  href?: string
}

interface Guide {
  id?: string
  title: string
  description: string
  is_published: boolean
  elements: GuideElement[]
}

export function MobileEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const guideId = searchParams.get("id")
  const [isMobile, setIsMobile] = useState(false)

  const [guide, setGuide] = useState<Guide>({
    title: "",
    description: "",
    is_published: false,
    elements: [],
  })
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("canvas")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (guideId) {
      loadGuide()
    }
  }, [guideId])

  const loadGuide = async () => {
    if (!guideId) return

    try {
      setLoading(true)
      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("*")
        .eq("id", guideId)
        .single()

      if (guideError) throw guideError

      const { data: elementsData, error: elementsError } = await supabase
        .from("guide_elements")
        .select("*")
        .eq("guide_id", guideId)
        .order("created_at", { ascending: true })

      if (elementsError) throw elementsError

      const elements: GuideElement[] = (elementsData || []).map((el) => ({
        id: el.id,
        type: el.type as GuideElement["type"],
        content: el.content,
        x: el.x,
        y: el.y,
        width: el.width || 200,
        height: el.height || 150,
        fontSize: el.font_size || 16,
        color: el.color || "#000000",
        backgroundColor: el.background_color || "transparent",
        borderColor: el.border_color || "#000000",
        borderWidth: el.border_width || 1,
        rotation: el.rotation || 0,
        layer: el.layer || 0,
        href: el.href || "",
      }))

      setGuide({
        id: guideData.id,
        title: guideData.title,
        description: guideData.description || "",
        is_published: guideData.is_published,
        elements,
      })
    } catch (error) {
      console.error("Error loading guide:", error)
      alert(`Error loading guide: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const addElement = (type: GuideElement["type"]) => {
    const newElement: GuideElement = {
      id: `temp-${Date.now()}`,
      type,
      content: type === "text" ? "Click to edit text" : type === "link" ? "https://example.com" : "",
      x: isMobile ? 20 : 100,
      y: isMobile ? 50 : 100,
      width: isMobile ? 150 : 200,
      height: type === "text" ? (isMobile ? 40 : 50) : isMobile ? 100 : 150,
      fontSize: isMobile ? 14 : 16,
      fontFamily: "Inter, sans-serif",
      color: "#000000",
      backgroundColor: type === "text" ? "transparent" : "#8b5cf6",
      borderColor: "#000000",
      borderWidth: type === "text" ? 0 : 2,
      layer: guide.elements.length,
    }
    setGuide((prev) => ({ ...prev, elements: [...prev.elements, newElement] }))
    setSelectedElement(newElement.id)
    if (isMobile) setActiveTab("properties")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newElement: GuideElement = {
          id: `temp-${Date.now()}`,
          type: "image",
          content: e.target?.result as string,
          x: isMobile ? 20 : 100,
          y: isMobile ? 50 : 100,
          width: isMobile ? 150 : 200,
          height: isMobile ? 100 : 150,
          layer: guide.elements.length,
        }
        setGuide((prev) => ({ ...prev, elements: [...prev.elements, newElement] }))
        setSelectedElement(newElement.id)
        if (isMobile) setActiveTab("properties")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newElement: GuideElement = {
          id: `temp-${Date.now()}`,
          type: "video",
          content: e.target?.result as string,
          x: isMobile ? 20 : 100,
          y: isMobile ? 50 : 100,
          width: isMobile ? 200 : 300,
          height: isMobile ? 150 : 200,
          layer: guide.elements.length,
        }
        setGuide((prev) => ({ ...prev, elements: [...prev.elements, newElement] }))
        setSelectedElement(newElement.id)
        if (isMobile) setActiveTab("properties")
      }
      reader.readAsDataURL(file)
    }
  }

  const updateElement = (id: string, updates: Partial<GuideElement>) => {
    setGuide((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }))
  }

  const deleteElement = (id: string) => {
    setGuide((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }))
    setSelectedElement(null)
  }

  const saveGuide = async (publish = false) => {
    if (!guide.title.trim()) return

    try {
      setSaving(true)

      const guideData = {
        title: guide.title,
        description: guide.description,
        is_published: publish,
        updated_at: new Date().toISOString(),
      }

      let savedGuideId = guide.id

      if (guide.id) {
        const { error: guideError } = await supabase.from("guides").update(guideData).eq("id", guide.id)
        if (guideError) throw guideError

        if (guide.elements.length > 0) {
          const { error: deleteError } = await supabase.from("guide_elements").delete().eq("guide_id", guide.id)
          if (deleteError) throw deleteError
        }
      } else {
        const { data: newGuide, error: guideError } = await supabase
          .from("guides")
          .insert({
            ...guideData,
            created_by: "RandomaticPerson",
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (guideError) throw guideError
        savedGuideId = newGuide.id
      }

      if (guide.elements.length > 0) {
        const elementsData = guide.elements.map((el) => ({
          guide_id: savedGuideId,
          type: el.type,
          content: el.content,
          x: el.x,
          y: el.y,
          width: el.width,
          height: el.height,
          font_size: el.fontSize || null,
          color: el.color || null,
          background_color: el.backgroundColor || null,
          border_color: el.borderColor || null,
          border_width: el.borderWidth || null,
          rotation: el.rotation || null,
          layer: el.layer || null,
          href: el.href || null,
          created_at: new Date().toISOString(),
        }))

        const { error: elementsError } = await supabase.from("guide_elements").insert(elementsData)
        if (elementsError) throw elementsError
      }

      setGuide((prev) => ({ ...prev, id: savedGuideId, is_published: publish }))
      console.log(`Guide ${publish ? "published" : "saved as draft"} successfully!`)
    } catch (error) {
      console.error("Error saving guide:", error)
      alert(`Error saving guide: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const renderElement = (element: GuideElement) => {
    const isSelected = selectedElement === element.id

    const commonStyle = {
      position: "absolute" as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      zIndex: element.layer || 1,
      border: isSelected ? "2px solid #ec4899" : "1px dashed #d1d5db",
      cursor: "pointer",
    }

    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedElement(element.id)
      if (isMobile) setActiveTab("properties")
    }

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
              backgroundColor: element.backgroundColor,
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              overflow: "hidden",
              wordWrap: "break-word",
              lineHeight: "1.2",
              whiteSpace: "pre-wrap",
            }}
            onClick={handleElementClick}
          >
            {element.content}
          </div>
        )

      case "image":
        return (
          <img
            key={element.id}
            src={element.content || "/placeholder.svg"}
            alt="Guide element"
            style={{
              ...commonStyle,
              objectFit: "cover",
            }}
            onClick={handleElementClick}
            draggable={false}
          />
        )

      case "video":
        return (
          <video
            key={element.id}
            src={element.content}
            style={{
              ...commonStyle,
              objectFit: "cover",
            }}
            onClick={handleElementClick}
            controls
          />
        )

      case "link":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              borderRadius: "8px",
              textDecoration: "underline",
            }}
            onClick={handleElementClick}
          >
            🔗 {element.content}
          </div>
        )

      case "rectangle":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
            }}
            onClick={handleElementClick}
          />
        )

      case "circle":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
              borderRadius: "50%",
            }}
            onClick={handleElementClick}
          />
        )

      case "triangle":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              width: 0,
              height: 0,
              borderLeft: `${element.width / 2}px solid transparent`,
              borderRight: `${element.width / 2}px solid transparent`,
              borderBottom: `${element.height}px solid ${element.backgroundColor}`,
            }}
            onClick={handleElementClick}
          />
        )

      default:
        return null
    }
  }

  const selectedEl = guide.elements.find((el) => el.id === selectedElement)

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p>Loading guide...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveGuide(false)}
              disabled={!guide.title.trim() || saving}
              className="text-white hover:bg-white/20"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => saveGuide(true)}
              disabled={!guide.title.trim() || saving}
              className="text-white hover:bg-white/20"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          <Input
            placeholder="Guide title..."
            value={guide.title}
            onChange={(e) => setGuide((prev) => ({ ...prev, title: e.target.value }))}
            className="bg-white/20 border-white/30 text-white placeholder-white/70 text-sm"
          />
        </div>
      </header>

      {/* Mobile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 bg-white border-b">
          <TabsTrigger value="canvas" className="text-xs">
            <Layers className="h-4 w-4 mr-1" />
            Canvas
          </TabsTrigger>
          <TabsTrigger value="elements" className="text-xs">
            <Type className="h-4 w-4 mr-1" />
            Add
          </TabsTrigger>
          <TabsTrigger value="properties" className="text-xs">
            <Settings className="h-4 w-4 mr-1" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="layers" className="text-xs">
            <Palette className="h-4 w-4 mr-1" />
            Layers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="canvas" className="flex-1 p-2 m-0">
          <div
            ref={canvasRef}
            className="relative w-full h-full bg-white rounded-lg shadow-sm border overflow-auto"
            onClick={() => setSelectedElement(null)}
            style={{ minHeight: "400px" }}
          >
            {guide.elements.map((element) => renderElement(element))}

            {guide.elements.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500 pointer-events-none">
                <div className="text-center">
                  <p className="text-sm mb-2">Start creating!</p>
                  <p className="text-xs">Use the Add tab to add elements</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="elements" className="flex-1 p-4 m-0 overflow-y-auto">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Content Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => addElement("text")} className="w-full justify-start" variant="outline">
                  <Type className="h-4 w-4 mr-2" />
                  Add Text
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
                <Button onClick={() => addElement("link")} className="w-full justify-start" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Shapes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => addElement("rectangle")} className="w-full justify-start" variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Rectangle
                </Button>
                <Button onClick={() => addElement("circle")} className="w-full justify-start" variant="outline">
                  <Circle className="h-4 w-4 mr-2" />
                  Circle
                </Button>
                <Button onClick={() => addElement("triangle")} className="w-full justify-start" variant="outline">
                  <Triangle className="h-4 w-4 mr-2" />
                  Triangle
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="flex-1 p-4 m-0 overflow-y-auto">
          {selectedEl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Edit Element</h3>
                <Button variant="ghost" size="sm" onClick={() => deleteElement(selectedEl.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              {selectedEl.type === "text" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={selectedEl.content}
                      onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Font Size</label>
                    <Input
                      type="number"
                      value={selectedEl.fontSize || 16}
                      onChange={(e) => updateElement(selectedEl.id, { fontSize: Number.parseInt(e.target.value) })}
                      className="mt-1"
                      min="8"
                      max="72"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Text Color</label>
                    <Input
                      type="color"
                      value={selectedEl.color || "#000000"}
                      onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                </>
              )}

              {selectedEl.type === "link" && (
                <div>
                  <label className="text-sm font-medium">URL</label>
                  <Input
                    value={selectedEl.content}
                    onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                    className="mt-1"
                    placeholder="https://example.com"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Width</label>
                  <Input
                    type="number"
                    value={selectedEl.width}
                    onChange={(e) => updateElement(selectedEl.id, { width: Number.parseInt(e.target.value) })}
                    className="mt-1"
                    min="20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Height</label>
                  <Input
                    type="number"
                    value={selectedEl.height}
                    onChange={(e) => updateElement(selectedEl.id, { height: Number.parseInt(e.target.value) })}
                    className="mt-1"
                    min="20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">X Position</label>
                  <Input
                    type="number"
                    value={selectedEl.x}
                    onChange={(e) => updateElement(selectedEl.id, { x: Number.parseInt(e.target.value) })}
                    className="mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Y Position</label>
                  <Input
                    type="number"
                    value={selectedEl.y}
                    onChange={(e) => updateElement(selectedEl.id, { y: Number.parseInt(e.target.value) })}
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Select an element to edit its properties</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="layers" className="flex-1 p-4 m-0 overflow-y-auto">
          <div className="space-y-2">
            <h3 className="font-medium mb-3">Element Layers</h3>
            {guide.elements
              .sort((a, b) => (b.layer || 0) - (a.layer || 0))
              .map((element, index) => (
                <div
                  key={element.id}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    selectedElement === element.id ? "border-fuchsia-500 bg-fuchsia-50" : "border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedElement(element.id)
                    setActiveTab("properties")
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {element.type === "text" && <Type className="h-4 w-4" />}
                      {element.type === "image" && <ImageIcon className="h-4 w-4" />}
                      {element.type === "video" && <Video className="h-4 w-4" />}
                      {element.type === "link" && <Share2 className="h-4 w-4" />}
                      {element.type === "rectangle" && <Square className="h-4 w-4" />}
                      {element.type === "circle" && <Circle className="h-4 w-4" />}
                      {element.type === "triangle" && <Triangle className="h-4 w-4" />}
                      <span className="text-sm font-medium capitalize">{element.type}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Layer {element.layer || 0}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {element.type === "text" ? element.content : `${element.width}×${element.height}`}
                  </p>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
    </div>
  )
}
