"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

interface Guide {
  id: string
  title: string
  content: string
}

const EnhancedGuideEditor: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([])
  const [newGuideTitle, setNewGuideTitle] = useState("")
  const [newGuideContent, setNewGuideContent] = useState("")
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    const { data, error } = await supabase.from("guides").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching guides:", error)
    } else {
      setGuides(data || [])
    }
  }

  const createGuide = async () => {
    if (!newGuideTitle || !newGuideContent) {
      alert("Please enter both title and content.")
      return
    }

    const { data, error } = await supabase
      .from("guides")
      .insert([{ title: newGuideTitle, content: newGuideContent }])
      .select()

    if (error) {
      console.error("Error creating guide:", error)
      alert("Failed to create guide.")
    } else {
      setGuides([...guides, ...(data || [])])
      setNewGuideTitle("")
      setNewGuideContent("")
    }
  }

  const updateGuide = async () => {
    if (!selectedGuide) {
      alert("No guide selected.")
      return
    }

    if (!editedTitle || !editedContent) {
      alert("Please enter both title and content.")
      return
    }

    const { error } = await supabase
      .from("guides")
      .update({ title: editedTitle, content: editedContent })
      .eq("id", selectedGuide.id)

    if (error) {
      console.error("Error updating guide:", error)
      alert("Failed to update guide.")
    } else {
      fetchGuides()
      setSelectedGuide(null)
      setEditedTitle("")
      setEditedContent("")
    }
  }

  const deleteGuide = async (id: string) => {
    const { error } = await supabase.from("guides").delete().eq("id", id)

    if (error) {
      console.error("Error deleting guide:", error)
      alert("Failed to delete guide.")
    } else {
      fetchGuides()
      setSelectedGuide(null)
      setEditedTitle("")
      setEditedContent("")
    }
  }

  const handleGuideSelect = (guide: Guide) => {
    setSelectedGuide(guide)
    setEditedTitle(guide.title)
    setEditedContent(guide.content)
  }

  return (
    <div>
      <h1>Enhanced Guide Editor</h1>

      <div>
        <h2>Create New Guide</h2>
        <input
          type="text"
          placeholder="Title"
          value={newGuideTitle}
          onChange={(e) => setNewGuideTitle(e.target.value)}
        />
        <textarea placeholder="Content" value={newGuideContent} onChange={(e) => setNewGuideContent(e.target.value)} />
        <button onClick={createGuide}>Create Guide</button>
      </div>

      <div>
        <h2>Guides</h2>
        <ul>
          {guides.map((guide) => (
            <li key={guide.id} onClick={() => handleGuideSelect(guide)}>
              {guide.title}
            </li>
          ))}
        </ul>
      </div>

      {selectedGuide && (
        <div>
          <h2>Edit Guide</h2>
          <input type="text" placeholder="Title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
          <textarea placeholder="Content" value={editedContent} onChange={(e) => setEditedContent(e.target.value)} />
          <button onClick={updateGuide}>Update Guide</button>
          <button onClick={() => deleteGuide(selectedGuide.id)}>Delete Guide</button>
        </div>
      )}
    </div>
  )
}

export default EnhancedGuideEditor
