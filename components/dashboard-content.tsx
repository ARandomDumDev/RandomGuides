"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const DashboardContent = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("your_table_name") // Replace 'your_table_name' with your actual table name
          .select("*")

        if (error) {
          setError(error)
        } else {
          setData(data)
        }
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1>Dashboard Content</h1>
      {data && (
        <ul>
          {data.map((item: any) => (
            <li key={item.id}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DashboardContent
