"use client"

import { useRef, useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { api } from "@/lib/api"

interface ChatWindowProps {
  selectedRegion: string | null
  currentYear: number
  currentQuery: string
  chatHistory: ChatMessage[]
  setChatHistory: (messages: ChatMessage[]) => void
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function ChatWindow({
  selectedRegion,
  currentYear,
  currentQuery,
  chatHistory,
  setChatHistory,
}: ChatWindowProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [scrollRef]) //Fixed unnecessary dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const newMessage: ChatMessage = { role: "user", content: input }
      setChatHistory([...chatHistory, newMessage])
      setInput("")
      setIsLoading(true)

      try {
        const response = await api.getChatResponse(input, selectedRegion, { year: currentYear, query: currentQuery })
        const assistantMessage: ChatMessage = { role: "assistant", content: response }
        setChatHistory([...chatHistory, newMessage, assistantMessage])
      } catch (error) {
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        }
        setChatHistory([...chatHistory, newMessage, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className={`fixed md:relative bottom-0 right-0 w-full md:w-96 ${isOpen ? 'h-[40vh]' : 'h-12'} md:h-full transition-all duration-300 bg-black z-20`}>
      <div className="p-2 border-b border-white/10 flex items-center justify-between">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium flex items-center gap-2"
        >
          {isOpen ? '◼︎' : '◻︎'} Timeline Chat
          {selectedRegion && <span className="text-white/60">({selectedRegion})</span>}
        </button>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            ×
          </button>
        )}
      </div>
      
      {isOpen && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {chatHistory.map((message, i) => (
                <div key={i} className={`flex items-start space-x-2 animate-fade-in`}>
                  <div
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      message.role === "user" ? "bg-white/5 text-white" : "bg-white/10 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedRegion ? `Ask about ${selectedRegion}'s timeline...` : "Ask about this global timeline..."
                }
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-white/40"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-white/10 hover:bg-white/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

