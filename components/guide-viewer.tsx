"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../app/lib/supabase"

interface GuideViewerProps {
  guideId: string
}

const GuideViewer: React.FC<GuideViewerProps> = ({ guideId }) => {
  const [guideContent, setGuideContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuideContent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase.from("guides").select("content").eq("id", guideId).single()

        if (error) {
          console.error("Error fetching guide content:", error)
          setError("Failed to load guide content.")
        }

        if (data) {
          setGuideContent(data.content)
        } else {
          setError("Guide not found.")
        }
      } catch (err) {
        console.error("Unexpected error fetching guide:", err)
        setError("An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuideContent()
  }, [guideId])

  if (isLoading) {
    return <div>Loading guide...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!guideContent) {
    return <div>Guide content not available.</div>
  }

  return (
    <div className="guide-viewer">
      <div dangerouslySetInnerHTML={{ __html: guideContent }} />
    </div>
  )
}

export { GuideViewer }
export default GuideViewer
