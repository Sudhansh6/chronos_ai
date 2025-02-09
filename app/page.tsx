"use client"

import { SearchBar } from "../components/SearchBar"
import { TimelineOverlay } from "../components/TimelineOverlay"
import { ResultsSummary } from "../components/ResultsSummary"
import { useState } from "react"
import { Timeline } from "@/types"
import { ProcessedTimelineData } from "@/types"
import { ChatWindow } from "../components/ChatWindow"
import { Chat } from "../components/Chat"

export default function HomePage() {
  const [summaryData, setSummaryData] = useState<ProcessedTimelineData>()
  const [currentTimeline, setCurrentTimeline] = useState<Timeline>({
    year: 1800,
    query: ""
  })

  const handleTimelineUpdate = async (data: ProcessedTimelineData) => {
    setSummaryData(data)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[rgb(var(--background))]">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 gradient-text">Chronos AI</h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-8 gradient-text">
          Explore Alternate Timelines
        </h2>
        <p className="text-lg md:text-xl text-center mb-12 text-gray-400">
          Choose a pivotal moment in history and see how the world would evolve
        </p>
        <SearchBar />
      </div>
    </main>
  )
}

