"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Type,
  ImageIcon,
  Eye,
  EyeOff,
  Trash2,
  Square,
  Circle,
  Triangle,
  Move,
  Maximize2,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface GuideElement {
  id: string
  type: "text" | "image" | "rectangle" | "circle" | "triangle"
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
}

interface Guide {
  id?: string
  title: string
  description: string
  is_published: boolean
  elements: GuideElement[]
}

type InteractionMode = "none" | "drag" | "scale"

export function GuideEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const guideId = searchParams.get("id")

  const [guide, setGuide] = useState<Guide>({
    title: "",
    description: "",
    is_published: false,
    elements: [],
  })
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("none")
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [resizingElement, setResizingElement] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [modeIndicator, setModeIndicator] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (guideId) {
      loadGuide()
    }
  }, [guideId])

  // Prevent all page scrolling and movement during editor use
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      // Prevent refresh
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault()
      }
      if (e.key === "F5") {
        e.preventDefault()
      }
      // Prevent zoom
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "0")) {
        e.preventDefault()
      }
    }

    // Prevent all scrolling on the editor page
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.height = "100%"

    // Add event listeners
    document.addEventListener("wheel", preventScroll, { passive: false })
    document.addEventListener("touchmove", preventScroll, { passive: false })
    document.addEventListener("scroll", preventScroll, { passive: false })
    document.addEventListener("keydown", preventKeyboardShortcuts)

    return () => {
      // Restore normal page behavior
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""

      document.removeEventListener("wheel", preventScroll)
      document.removeEventListener("touchmove", preventScroll)
      document.removeEventListener("scroll", preventScroll)
      document.removeEventListener("keydown", preventKeyboardShortcuts)
    }
  }, [])

  const loadGuide = async () => {
    if (!guideId) return

    try {
      setLoading(true)

      console.log("Loading guide with ID:", guideId)

      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("*")
        .eq("id", guideId)
        .single()

      if (guideError) {
        console.error("Error loading guide:", guideError)
        throw guideError
      }

      console.log("Loaded guide data:", guideData)

      const { data: elementsData, error: elementsError } = await supabase
        .from("guide_elements")
        .select("*")
        .eq("guide_id", guideId)
        .order("created_at", { ascending: true })

      if (elementsError) {
        console.error("Error loading elements:", elementsError)
        throw elementsError
      }

      console.log("Loaded elements data:", elementsData)
      console.log("Number of elements loaded:", elementsData?.length || 0)

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
      }))

      console.log("Processed elements:", elements)

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

  const addTextElement = () => {
    const newElement: GuideElement = {
      id: `temp-${Date.now()}`,
      type: "text",
      content: "Click to edit text",
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      fontSize: 16,
      fontFamily: "Inter, sans-serif",
      color: "#000000",
      backgroundColor: "transparent",
    }
    setGuide((prev) => ({ ...prev, elements: [...prev.elements, newElement] }))
    setSelectedElement(newElement.id)
  }

  const addImageElement = () => {
    fileInputRef.current?.click()
  }

  const addShape = (shapeType: "rectangle" | "circle" | "triangle") => {
    const newElement: GuideElement = {
      id: `temp-${Date.now()}`,
      type: shapeType,
      content: "",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      backgroundColor: "#8b5cf6",
      borderColor: "#000000",
      borderWidth: 2,
    }
    setGuide((prev) => ({ ...prev, elements: [...prev.elements, newElement] }))
    setSelectedElement(newElement.id)
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
          x: 100,
          y: 100,
          width: 200,
          height: 150,
        }
        setGuide((prev) => ({ ...prev, elements: [...prev.elements, newElement] }))
        setSelectedElement(newElement.id)
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

  const startDragMode = (elementId: string) => {
    setInteractionMode("drag")
    setDraggedElement(elementId)
    setModeIndicator("DRAG MODE - Move element around")
  }

  const startScaleMode = (elementId: string, handle: string) => {
    setInteractionMode("scale")
    setResizingElement(elementId)
    setResizeHandle(handle)
    setModeIndicator("SCALE MODE - Drag to resize")
  }

  const stopInteraction = () => {
    setInteractionMode("none")
    setDraggedElement(null)
    setResizingElement(null)
    setResizeHandle(null)
    setModeIndicator("")
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      if (interactionMode === "drag" && draggedElement) {
        const element = guide.elements.find((el) => el.id === draggedElement)
        if (!element) return

        const newX = Math.max(0, Math.min(mouseX - element.width / 2, rect.width - element.width))
        const newY = Math.max(0, Math.min(mouseY - element.height / 2, rect.height - element.height))
        updateElement(draggedElement, { x: newX, y: newY })
      } else if (interactionMode === "scale" && resizingElement && resizeHandle) {
        const element = guide.elements.find((el) => el.id === resizingElement)
        if (!element) return

        let newWidth = element.width
        let newHeight = element.height
        let newX = element.x
        let newY = element.y

        const minSize = 20
        const maxX = rect.width - minSize
        const maxY = rect.height - minSize

        switch (resizeHandle) {
          case "se":
            newWidth = Math.max(minSize, Math.min(mouseX - element.x, maxX - element.x))
            newHeight = Math.max(minSize, Math.min(mouseY - element.y, maxY - element.y))
            break
          case "sw":
            newWidth = Math.max(minSize, element.x + element.width - mouseX)
            newHeight = Math.max(minSize, Math.min(mouseY - element.y, maxY - element.y))
            newX = Math.max(0, Math.min(mouseX, element.x + element.width - minSize))
            break
          case "ne":
            newWidth = Math.max(minSize, Math.min(mouseX - element.x, maxX - element.x))
            newHeight = Math.max(minSize, element.y + element.height - mouseY)
            newY = Math.max(0, Math.min(mouseY, element.y + element.height - minSize))
            break
          case "nw":
            newWidth = Math.max(minSize, element.x + element.width - mouseX)
            newHeight = Math.max(minSize, element.y + element.height - mouseY)
            newX = Math.max(0, Math.min(mouseX, element.x + element.width - minSize))
            newY = Math.max(0, Math.min(mouseY, element.y + element.height - minSize))
            break
        }

        updateElement(resizingElement, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        })
      }
    },
    [interactionMode, draggedElement, resizingElement, resizeHandle, guide.elements],
  )

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
        // Update existing guide
        const { error: guideError } = await supabase.from("guides").update(guideData).eq("id", guide.id)
        if (guideError) throw guideError

        // Only delete elements if we have new ones to replace them
        if (guide.elements.length > 0) {
          const { error: deleteError } = await supabase.from("guide_elements").delete().eq("guide_id", guide.id)
          if (deleteError) throw deleteError
        }
      } else {
        // Create new guide
        const { data: newGuide, error: guideError } = await supabase
          .from("guides")
          .insert({
            ...guideData,
            created_by: "RandomaticPerson", // Keep this for backwards compatibility
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (guideError) throw guideError
        savedGuideId = newGuide.id
      }

      // Save elements if we have any
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
          created_at: new Date().toISOString(),
        }))

        const { error: elementsError } = await supabase.from("guide_elements").insert(elementsData)
        if (elementsError) {
          console.error("Error saving elements:", elementsError)
          throw elementsError
        }

        console.log(`Saved ${elementsData.length} elements successfully`)
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
    const isDragging = draggedElement === element.id
    const isResizing = resizingElement === element.id

    const commonStyle = {
      position: "absolute" as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      zIndex: isSelected ? 10 : 1,
    }

    const borderStyle = isSelected
      ? "2px solid #ec4899"
      : interactionMode === "none"
        ? "1px dashed #d1d5db"
        : "2px solid #06b6d4"

    let elementContent

    switch (element.type) {
      case "text":
        elementContent = (
          <div
            style={{
              ...commonStyle,
              fontSize: element.fontSize,
              fontFamily: element.fontFamily,
              color: element.color,
              backgroundColor: element.backgroundColor,
              border: borderStyle,
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              overflow: "hidden",
              wordWrap: "break-word",
              lineHeight: "1.2",
              whiteSpace: "pre-wrap",
              resize: "none",
            }}
          >
            {element.content}
          </div>
        )
        break

      case "image":
        elementContent = (
          <img
            src={element.content || "/placeholder.svg"}
            alt="Guide element"
            style={{
              ...commonStyle,
              objectFit: "cover",
              border: borderStyle,
            }}
            draggable={false}
          />
        )
        break

      case "rectangle":
        elementContent = (
          <div
            style={{
              ...commonStyle,
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
              outline: isSelected ? "2px solid #ec4899" : undefined,
            }}
          />
        )
        break

      case "circle":
        elementContent = (
          <div
            style={{
              ...commonStyle,
              backgroundColor: element.backgroundColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
              borderRadius: "50%",
              outline: isSelected ? "2px solid #ec4899" : undefined,
            }}
          />
        )
        break

      case "triangle":
        elementContent = (
          <div
            style={{
              ...commonStyle,
              width: 0,
              height: 0,
              borderLeft: `${element.width / 2}px solid transparent`,
              borderRight: `${element.width / 2}px solid transparent`,
              borderBottom: `${element.height}px solid ${element.backgroundColor}`,
              outline: isSelected ? "2px solid #ec4899" : undefined,
            }}
          />
        )
        break

      default:
        elementContent = null
    }

    return (
      <div key={element.id} className="group">
        <div
          onClick={(e) => {
            e.stopPropagation()
            setSelectedElement(element.id)
          }}
          style={{ cursor: "pointer" }}
        >
          {elementContent}
        </div>

        {/* Control buttons directly on the element */}
        {isSelected && interactionMode === "none" && (
          <div
            className="absolute"
            style={{ left: element.x, top: element.y, width: element.width, height: element.height, zIndex: 20 }}
          >
            {/* Drag button - center of element */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                startDragMode(element.id)
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 hover:bg-green-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              title="Click to drag element"
            >
              <Move className="h-4 w-4 text-white" />
            </button>

            {/* Scale buttons - corners */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                startScaleMode(element.id, "nw")
              }}
              className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              title="Click to scale from top-left"
            >
              <Maximize2 className="h-3 w-3 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                startScaleMode(element.id, "ne")
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              title="Click to scale from top-right"
            >
              <Maximize2 className="h-3 w-3 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                startScaleMode(element.id, "sw")
              }}
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              title="Click to scale from bottom-left"
            >
              <Maximize2 className="h-3 w-3 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                startScaleMode(element.id, "se")
              }}
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 hover:bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              title="Click to scale from bottom-right"
            >
              <Maximize2 className="h-3 w-3 text-white" />
            </button>

            {/* Stop interaction button */}
            {(isDragging || isResizing) && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  stopInteraction()
                }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded shadow-lg transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        )}
      </div>
    )
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
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm border-b p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Guide title..."
                value={guide.title}
                onChange={(e) => setGuide((prev) => ({ ...prev, title: e.target.value }))}
                className="text-lg font-semibold"
              />
              <Input
                placeholder="Description (optional)..."
                value={guide.description}
                onChange={(e) => setGuide((prev) => ({ ...prev, description: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addTextElement}>
              <Type className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button variant="outline" onClick={addImageElement}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" onClick={() => addShape("rectangle")}>
              <Square className="h-4 w-4 mr-2" />
              Rectangle
            </Button>
            <Button variant="outline" onClick={() => addShape("circle")}>
              <Circle className="h-4 w-4 mr-2" />
              Circle
            </Button>
            <Button variant="outline" onClick={() => addShape("triangle")}>
              <Triangle className="h-4 w-4 mr-2" />
              Triangle
            </Button>
            <Button
              variant="outline"
              onClick={() => saveGuide(false)}
              disabled={!guide.title.trim() || saving}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              {saving ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              onClick={() => saveGuide(true)}
              disabled={!guide.title.trim() || saving}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {saving ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </header>

      {/* Mode Indicator */}
      {modeIndicator && (
        <div className="bg-blue-500 text-white px-4 py-2 text-center font-medium flex items-center justify-center gap-2">
          {modeIndicator}
          <button
            onClick={stopInteraction}
            className="ml-4 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
          >
            Stop
          </button>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 overflow-hidden">
          <div
            ref={canvasRef}
            className="relative w-full h-full bg-white rounded-lg shadow-sm border overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={stopInteraction}
            onMouseLeave={stopInteraction}
            onClick={() => setSelectedElement(null)}
            style={{ minHeight: "600px" }}
          >
            {guide.elements.map((element) => renderElement(element))}

            {guide.elements.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500 pointer-events-none">
                <div className="text-center">
                  <p className="text-lg mb-2">Start creating your guide!</p>
                  <p className="text-sm">Add text, images, or shapes using the buttons above</p>
                  <p className="text-xs mt-4 text-gray-400">
                    💡 Tip: Click elements to select, then use the control buttons
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedEl && (
          <div className="w-80 bg-white border-l p-4 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Element Properties</h3>
              <Button variant="ghost" size="sm" onClick={() => deleteElement(selectedEl.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="space-y-4">
              {selectedEl.type === "text" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={selectedEl.content}
                      onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                      className="mt-1"
                      rows={4}
                      placeholder="Enter your text here..."
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
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={selectedEl.color || "#000000"}
                        onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={selectedEl.color || "#000000"}
                        onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </>
              )}

              {(selectedEl.type === "rectangle" || selectedEl.type === "circle" || selectedEl.type === "triangle") && (
                <>
                  <div>
                    <label className="text-sm font-medium">Fill Color</label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        value={selectedEl.backgroundColor || "#8b5cf6"}
                        onChange={(e) => updateElement(selectedEl.id, { backgroundColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={selectedEl.backgroundColor || "#8b5cf6"}
                        onChange={(e) => updateElement(selectedEl.id, { backgroundColor: e.target.value })}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                  {selectedEl.type !== "triangle" && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Border Color</label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={selectedEl.borderColor || "#000000"}
                            onChange={(e) => updateElement(selectedEl.id, { borderColor: e.target.value })}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={selectedEl.borderColor || "#000000"}
                            onChange={(e) => updateElement(selectedEl.id, { borderColor: e.target.value })}
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Border Width</label>
                        <Input
                          type="number"
                          value={selectedEl.borderWidth || 1}
                          onChange={(e) =>
                            updateElement(selectedEl.id, { borderWidth: Number.parseInt(e.target.value) })
                          }
                          className="mt-1"
                          min="0"
                          max="20"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div>
                <label className="text-sm font-medium">Background Color</label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={selectedEl.backgroundColor || "#ffffff"}
                    onChange={(e) => updateElement(selectedEl.id, { backgroundColor: e.target.value })}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={selectedEl.backgroundColor || "#ffffff"}
                    onChange={(e) => updateElement(selectedEl.id, { backgroundColor: e.target.value })}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

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

              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">How to Use:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Click the green center button to drag</li>
                  <li>• Click blue corner buttons to scale</li>
                  <li>• Click "Stop" to exit drag/scale mode</li>
                  <li>• Edit properties in this panel</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
    </div>
  )
}
