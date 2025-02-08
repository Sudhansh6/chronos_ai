"use client"

import React, { useState } from "react"
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
    query: searchParams?.get("query") || "Global Timeline",
  })
  const [previousTimelines, setPreviousTimelines] = React.useState<Timeline[]>([])
  const [totalScore, setTotalScore] = React.useState(0)
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({})

  const handleNewBranch = (year: number, query: string) => {
    setPreviousTimelines((prev) => [...prev, currentTimeline])
    setCurrentTimeline({ year, query })
    // Clear chat for the new timeline
    setChatHistory((prev) => ({ ...prev, [`${year}-${query}`]: [] }))
  }

  const handleBacktrack = (index: number) => {
    const newCurrent = previousTimelines[index]
    setCurrentTimeline(newCurrent)
    setPreviousTimelines((prev) => prev.slice(0, index))
    // Fetch corresponding results and chat when returning to a previous timeline
    // (This is handled automatically by the useEffect hooks in child components)
  }

  const handleScoreUpdate = (score: number) => {
    setTotalScore(score)
  }

  return (
    <motion.div
      className="flex flex-col h-screen bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Clock className="text-white/60" />
            <div>
              <h2 className="text-lg font-medium text-white">{currentTimeline.query}</h2>
              <p className="text-sm text-white/60">Year: {currentTimeline.year}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {selectedRegion && (
              <motion.div
                className="text-sm text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Focusing on: {selectedRegion}
              </motion.div>
            )}
            <ScoreDisplay score={totalScore} />
          </div>
        </div>
      </motion.div>

      <TimelineChain
        currentTimeline={currentTimeline}
        previousTimelines={previousTimelines}
        onSelectTimeline={handleBacktrack}
      />

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
                onScoreUpdate={handleScoreUpdate}
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

