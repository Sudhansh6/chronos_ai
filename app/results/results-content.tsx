"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { ResultsTabs } from "@/components/ResultsTabs"
import { ChatWindow } from "@/components/ChatWindow"
import { TimelineOverlay } from "@/components/TimelineOverlay"
import { TimelineChain } from "@/components/TimelineChain"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { Clock } from "lucide-react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"

const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <motion.div
      className="w-full h-full flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-white">Loading interactive globe...</div>
    </motion.div>
  ),
})

interface Timeline {
  year: number
  query: string
}

interface ChatMessage {
  text: string
  sender: string
}

export default function ResultsContent() {
  const searchParams = useSearchParams()
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null)
  const [currentTimeline, setCurrentTimeline] = React.useState<Timeline>({
    year: Number(searchParams?.get("year")) || 2023,
    query: decodeURIComponent(searchParams?.get("query") || "Global Timeline"),
  })
  const [previousTimelines, setPreviousTimelines] = React.useState<Timeline[]>([])
  const [totalScore, setTotalScore] = React.useState(0)
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({})
  const [data, setData] = useState<ProcessedTimelineData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const result = await api.getTimelineData({
          year: currentTimeline.year,
          query: currentTimeline.query
        })
        setData(result)
        setTotalScore(result.totalScore)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load timeline data")
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentTimeline])

  const handleNewBranch = (year: number, query: string) => {
    setPreviousTimelines((prev) => [...prev, currentTimeline])
    setCurrentTimeline({ year, query })
    setChatHistory((prev) => ({ ...prev, [`${year}-${query}`]: [] }))
  }

  const handleBacktrack = (index: number) => {
    const newCurrent = previousTimelines[index]
    setCurrentTimeline(newCurrent)
    setPreviousTimelines((prev) => prev.slice(0, index))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Loading timeline data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <motion.div
      className="flex flex-col h-screen bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ... existing header and timeline chain code ... */}

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={75} minSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75} minSize={30}>
              <div className="relative h-full">
                <Globe onRegionSelect={setSelectedRegion} selectedRegion={selectedRegion} />
                <TimelineOverlay
                  currentYear={currentTimeline.year}
                  currentQuery={currentTimeline.query}
                  onNewBranch={handleNewBranch}
                  onBacktrack={() => handleBacktrack(previousTimelines.length - 1)}
                  previousTimelines={previousTimelines}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20}>
              <ResultsTabs
                selectedRegion={selectedRegion}
                currentYear={currentTimeline.year}
                currentQuery={currentTimeline.query}
                onScoreUpdate={setTotalScore}
                initialData={data}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={20}>
          <ChatWindow
            selectedRegion={selectedRegion}
            currentYear={currentTimeline.year}
            currentQuery={currentTimeline.query}
            chatHistory={chatHistory[`${currentTimeline.year}-${currentTimeline.query}`] || []}
            setChatHistory={(messages) =>
              setChatHistory((prev) => ({
                ...prev,
                [`${currentTimeline.year}-${currentTimeline.query}`]: messages,
              }))
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </motion.div>
  )
}

