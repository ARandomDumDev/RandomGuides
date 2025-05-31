"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Loader2, Share2, ThumbsUp, Bookmark } from "lucide-react"
import Link from "next/link"
import { supabase, type Guide } from "@/lib/supabase"
import { getStoredUser } from "@/lib/auth-utils"

interface GuideElement {
  id: string
  guide_id: string
  type: "text" | "image" | "rectangle" | "circle" | "triangle"
  content: string
  x: number
  y: number
  width: number
  height: number
  font_size?: number
  color?: string
  background_color?: string
  border_color?: string
  border_width?: number
  rotation?: number
  created_at: string
}

interface GuideViewerProps {
  guideId: string
}

export function GuideViewer({ guideId }: GuideViewerProps) {
  const [guide, setGuide] = useState<Guide | null>(null)
  const [elements, setElements] = useState<GuideElement[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    fetchGuide()
    checkIfCreator()
  }, [guideId])

  const fetchGuide = async () => {
    try {
      setLoading(true)

      console.log("Fetching guide with ID:", guideId)

      // Fetch the guide
      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("*")
        .eq("id", guideId)
        .eq("is_published", true)
        .single()

      if (guideError) {
        console.error("Error fetching guide:", guideError)
        throw guideError
      }

      console.log("Guide data:", guideData)
      setGuide(guideData)

      // Fetch the guide elements
      const { data: elementsData, error: elementsError } = await supabase
        .from("guide_elements")
        .select("*")
        .eq("guide_id", guideId)
        .order("created_at", { ascending: true })

      if (elementsError) {
        console.error("Error fetching elements:", elementsError)
        throw elementsError
      }

      console.log("Elements data:", elementsData)
      console.log("Number of elements found:", elementsData?.length || 0)

      setElements(elementsData || [])
    } catch (error) {
      console.error("Error fetching guide:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfCreator = () => {
    try {
      // Only check local storage, no async operations
      const storedUser = getStoredUser()
      if (storedUser && storedUser.authenticated) {
        setIsCreator(true)
      }
    } catch (error) {
      console.error("Creator check error:", error)
    }
  }

  const renderElement = (element: GuideElement) => {
    const commonStyle = {
      position: "absolute" as const,
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    }

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              fontSize: element.font_size || 16,
              color: element.color || "#000000",
              backgroundColor: element.background_color || "transparent",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              overflow: "hidden",
              wordWrap: "break-word",
              lineHeight: "1.2",
              fontFamily: "Inter, sans-serif",
              whiteSpace: "pre-wrap", // This preserves line breaks and spaces
            }}
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
            draggable={false}
          />
        )

      case "rectangle":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              backgroundColor: element.background_color || "#8b5cf6",
              border: `${element.border_width || 1}px solid ${element.border_color || "#000000"}`,
            }}
          />
        )

      case "circle":
        return (
          <div
            key={element.id}
            style={{
              ...commonStyle,
              backgroundColor: element.background_color || "#8b5cf6",
              border: `${element.border_width || 1}px solid ${element.border_color || "#000000"}`,
              borderRadius: "50%",
            }}
          />
        )

      case "triangle":
        return (
          <div
            key={element.id}
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              width: 0,
              height: 0,
              borderLeft: `${element.width / 2}px solid transparent`,
              borderRight: `${element.width / 2}px solid transparent`,
              borderBottom: `${element.height}px solid ${element.background_color || "#8b5cf6"}`,
              transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            }}
          />
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
          <span className="ml-2 text-gray-600">Loading guide...</span>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide not found</h1>
          <p className="text-gray-600 mb-4">This guide may have been removed or doesn't exist.</p>
          <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Guides
              </Link>
            </Button>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{guide.title}</h1>
            {guide.description && <p className="text-white/90 text-lg mb-4">{guide.description}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center">
                <span className="font-medium">By:</span>
                <span className="ml-1">{guide.created_by}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Created:</span>
                <span className="ml-1">{new Date(guide.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-5xl">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Guide Content</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-fuchsia-600">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-fuchsia-600">
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-fuchsia-600">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Like
              </Button>
              {isCreator && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-fuchsia-200 text-fuchsia-600 hover:bg-fuchsia-50"
                  asChild
                >
                  <Link href={`/editor?id=${guide.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div
            className="relative w-full overflow-hidden p-4 bg-gray-50"
            style={{
              minHeight: "600px",
              height:
                elements.length > 0 ? Math.max(600, Math.max(...elements.map((el) => el.y + el.height)) + 50) : 600,
            }}
          >
            {elements.map((element) => renderElement(element))}

            {elements.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>This guide doesn't have any content yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-fuchsia-800 mb-2">About RandomGuides</h3>
          <p className="text-fuchsia-700">
            We're all about sharing knowledge that actually matters. No cap, just straight facts to help you level up.
            If you found this guide helpful, share it with your friends!
          </p>
        </div>
      </div>
    </div>
  )
}
