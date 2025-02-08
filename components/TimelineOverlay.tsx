"use client"

import React from "react"
import { ArrowLeft, Clock } from "lucide-react"
import { api } from "@/lib/api"

interface TimelineOverlayProps {
  currentYear: number
  currentQuery: string
  onNewBranch: (year: number, query: string) => void
  onBacktrack: () => void
  previousTimelines: Array<{ year: number; query: string }>
  onTimelineUpdate: (data: ProcessedTimelineData) => void
}

export function TimelineOverlay({
  currentYear,
  currentQuery,
  onNewBranch,
  onBacktrack,
  previousTimelines,
  onTimelineUpdate,
}: TimelineOverlayProps) {
  const [year, setYear] = React.useState<number>(currentYear + 1)
  const [query, setQuery] = React.useState("")
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && year > currentYear) {
      try {
        const newTimeline = { year, query }
        const data = await api.getTimelineData(newTimeline)
        onNewBranch(year, query)
        onTimelineUpdate(data)
        setQuery("")
        setIsExpanded(false)
      } catch (error) {
        console.error("Failed to update timeline:", error)
      }
    }
  }

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/80 hover:text-white flex items-center gap-2"
          >
            <Clock size={16} />
            <span>Modify Timeline</span>
          </button>
          {previousTimelines.length > 0 && (
            <button onClick={onBacktrack} className="text-white/80 hover:text-white flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Previous Timeline</span>
            </button>
          )}
        </div>

        {isExpanded && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-white/60 mb-1">New Pivotal Year</label>
                <input
                  type="number"
                  min={currentYear + 1}
                  max={2023}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
                />
              </div>
              <div className="flex-[2]">
                <label className="block text-sm text-white/60 mb-1">What if...</label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a new alternate history scenario..."
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!query.trim() || year <= currentYear}
              className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-white/10 text-white py-2 rounded-md transition-colors"
            >
              Create New Branch
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

