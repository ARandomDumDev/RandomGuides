"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

interface NotificationBadgeProps {
  userId: string
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ userId }) => {
  const [notificationCount, setNotificationCount] = useState<number>(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact" })
          .eq("user_id", userId)
          .eq("is_read", false)

        if (error) {
          console.error("Error fetching notifications:", error)
        }

        if (data) {
          setNotificationCount(data.length)
        }
      } catch (error) {
        console.error("Unexpected error fetching notifications:", error)
      }
    }

    fetchNotifications()

    const channel = supabase
      .channel("any")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          fetchNotifications()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  if (notificationCount === 0) {
    return null
  }

  return (
    <div className="relative inline-block">
      <div className="absolute top-0 right-0 flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {notificationCount}
      </div>
    </div>
  )
}

export { NotificationBadge }
export default NotificationBadge
