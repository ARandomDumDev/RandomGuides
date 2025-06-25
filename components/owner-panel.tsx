"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "../app/lib/supabase"

interface OwnerPanelProps {
  userId: string
}

const OwnerPanel: React.FC<OwnerPanelProps> = ({ userId }) => {
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkOwnership = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.from("users").select("*").eq("id", userId).eq("is_moderator", true)

        if (error) {
          console.error("Error fetching owner data:", error)
          setIsOwner(false)
        } else {
          setIsOwner(data.length > 0)
        }
      } finally {
        setLoading(false)
      }
    }

    checkOwnership()
  }, [userId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {isOwner ? (
        <div>
          <h2>Owner Panel</h2>
          <p>You are an owner.</p>
          {/* Add owner-specific functionality here */}
        </div>
      ) : (
        <div>
          <p>You are not an owner.</p>
        </div>
      )}
    </div>
  )
}

export { OwnerPanel }
export default OwnerPanel
