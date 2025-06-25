"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../app/lib/supabase"

interface GuideEditorProps {
  guideId?: string
}

const GuideEditor: React.FC<GuideEditorProps> = ({ guideId }) => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (guideId) {
      fetchGuide(guideId)
    }
  }, [guideId])

  const fetchGuide = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.from("guides").select("*").eq("id", id).single()

      if (error) {
        throw error
      }

      if (data) {
        setTitle(data.title)
        setContent(data.content)
      } else {
        setError("Guide not found.")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the guide.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (guideId) {
        // Update existing guide
        const { error } = await supabase.from("guides").update({ title, content }).eq("id", guideId)

        if (error) {
          throw error
        }
        alert("Guide updated successfully!")
      } else {
        // Create new guide
        const { data, error } = await supabase.from("guides").insert([{ title, content }]).select()

        if (error) {
          throw error
        }

        if (data && data.length > 0) {
          // Optionally redirect to the new guide's page
          alert("Guide created successfully!")
          setTitle("")
          setContent("")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the guide.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
          Title:
        </label>
        <input
          type="text"
          id="title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
          Content:
        </label>
        <textarea
          id="content"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        ></textarea>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSave}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </div>
  )
}

export { GuideEditor }
export default GuideEditor
