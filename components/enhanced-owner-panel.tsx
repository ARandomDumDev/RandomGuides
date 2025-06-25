"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"

interface Owner {
  id: string
  name: string
  email: string
}

interface EnhancedOwnerPanelProps {
  ownerId: string
}

const EnhancedOwnerPanel: React.FC<EnhancedOwnerPanelProps> = ({ ownerId }) => {
  const [owner, setOwner] = useState<Owner | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.from("owners").select("*").eq("id", ownerId).single()

        if (error) {
          throw new Error(error.message)
        }

        if (data) {
          setOwner({
            id: data.id,
            name: data.name,
            email: data.email,
          })
        } else {
          setError("Owner not found.")
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOwner()
  }, [ownerId])

  if (loading) {
    return <div>Loading owner data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!owner) {
    return <div>Owner not found.</div>
  }

  return (
    <div>
      <h3>Owner Details</h3>
      <p>ID: {owner.id}</p>
      <p>Name: {owner.name}</p>
      <p>Email: {owner.email}</p>
    </div>
  )
}

export default EnhancedOwnerPanel
