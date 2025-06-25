"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"

interface Message {
  id: string
  created_at: string
  content: string
  user_id: string
}

const GlobalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50)

      if (error) {
        console.error("Error fetching initial messages:", error)
      } else {
        setMessages(data || [])
      }
    }

    fetchInitialMessages()

    const subscription = supabase
      .from("messages")
      .on("*", (update) => {
        setMessages((currentMessages) => {
          if (update.eventType === "INSERT") {
            return [...currentMessages, update.new as Message]
          }
          return currentMessages
        })
      })
      .subscribe()

    return () => {
      supabase.removeSubscription(subscription)
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { data, error } = await supabase
        .from("messages")
        .insert([{ content: newMessage, user_id: supabase.auth.user()?.id }])

      if (error) {
        console.error("Error sending message:", error)
      } else {
        setNewMessage("")
      }
    }
  }

  return (
    <div className="flex flex-col h-96 border rounded p-2">
      <div ref={chatContainerRef} className="overflow-y-auto flex-grow">
        {messages.map((message) => (
          <div key={message.id} className="mb-1">
            <span className="font-semibold">{message.user_id}:</span> {message.content}
          </div>
        ))}
      </div>
      <div className="mt-2">
        <input
          type="text"
          className="w-full border rounded p-1"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-1 px-2 rounded mt-1" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

export default GlobalChat
