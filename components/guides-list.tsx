"use client"

import { useEffect, useState } from "react"
import { supabase } from "../app/lib/supabase"
import type { Guide } from "../app/lib/supabase"
import Link from "next/link"

const GuidesList = () => {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("guides").select("*").order("created_at", { ascending: false })

        if (error) {
          setError(error.message)
        } else {
          setGuides(data || [])
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGuides()
  }, [])

  if (loading) {
    return <p>Loading guides...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div>
      <h2>Guides</h2>
      {guides.length === 0 ? (
        <p>No guides found.</p>
      ) : (
        <ul>
          {guides.map((guide) => (
            <li key={guide.id}>
              <Link href={`/guides/${guide.id}`}>{guide.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { GuidesList }
export default GuidesList
