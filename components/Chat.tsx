"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"

interface ChatProps {
  selectedRegion: string | null
}

interface Message {
  text: string
  isUser: boolean
}

export function Chat({ selectedRegion }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messagesEndRef])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && selectedRegion) {
      setMessages((prev) => [...prev, { text: input, isUser: true }])
      setInput("")
      setIsThinking(true)

      try {
        const response = await fetch(
          `http://localhost:8000/api/chat/${selectedRegion}?message=${encodeURIComponent(input)}`,
          { method: "POST" },
        )
        const data = await response.json()
        setMessages((prev) => [...prev, { text: data.message, isUser: false }])
      } catch (error) {
        console.error("Error fetching chat response:", error)
        setMessages((prev) => [...prev, { text: "Sorry, there was an error processing your request.", isUser: false }])
      } finally {
        setIsThinking(false)
      }
    }
  }

  return (
    <div className={`fixed md:relative bottom-0 left-0 w-full md:w-80 ${isOpen ? 'h-[40vh]' : 'h-12'} transition-all duration-300 z-20`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 bg-[rgb(var(--background))] text-white flex items-center justify-between"
      >
        <span>Whispers of Altered Realities</span>
        {isOpen ? '▼' : '▲'}
      </button>
      
      {isOpen && (
        <div className="h-full bg-muted flex flex-col border-t border-gray-800">
          <div className="p-4 bg-[rgb(var(--background))] text-white font-semibold">
            Whispers of Altered Realities
            {selectedRegion && <span className="ml-2 text-sm text-gray-400">({selectedRegion})</span>}
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`${msg.isUser ? "text-right" : "text-left"}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.isUser ? "bg-[rgb(var(--accent))]" : "bg-gray-700"}`}>
                  {msg.text}
                </span>
              </div>
            ))}
            {isThinking && (
              <div className="text-left">
                <span className="inline-block p-2 rounded-lg bg-gray-700">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-[rgb(var(--background))]">
            <div className="flex items-center bg-muted rounded-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about your alternate timeline in ${selectedRegion || "the world"}...`}
                className="flex-grow bg-transparent p-2 rounded-l-full focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-full bg-[rgb(var(--accent))] text-white"
                disabled={!selectedRegion}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

