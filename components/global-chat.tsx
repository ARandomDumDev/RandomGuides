"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, X, Users, Clock } from "lucide-react"
import { getStoredUser } from "@/lib/auth-utils"

interface ChatMessage {
  id: string
  username: string
  message: string
  timestamp: string
  isOwner?: boolean
}

export function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)

    if (isOpen) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000) // Poll every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chat/messages")
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setIsDisabled(data.disabled || false)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isDisabled) return

    try {
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-t-lg p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Global Chat
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              <Users className="h-3 w-3 mr-1" />
              {messages.length > 0 ? new Set(messages.map((m) => m.username)).size : 0}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Clock className="h-3 w-3" />
          Messages clear every hour
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        {isDisabled ? (
          <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
              <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Chat Under Maintenance</p>
              <p className="text-xs text-gray-400">The chat is temporarily disabled</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-2">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    <MessageCircle className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                    <p>No messages yet</p>
                    <p className="text-xs">Be the first to say hello!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${msg.isOwner ? "text-fuchsia-600" : "text-gray-700"}`}>
                          {msg.username}
                          {msg.isOwner && <Badge className="ml-1 text-xs bg-fuchsia-100 text-fuchsia-700">Owner</Badge>}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="text-sm bg-gray-50 rounded-lg p-2 break-words">{msg.message}</div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {user ? (
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 text-sm"
                    maxLength={200}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Chatting as {user.username} • {200 - newMessage.length} chars left
                </p>
              </div>
            ) : (
              <div className="p-3 border-t text-center">
                <p className="text-sm text-gray-500 mb-2">Sign in to join the chat</p>
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white" asChild>
                  <a href="/login">Sign In</a>
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
