"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { api, type TabContent } from "@/lib/api"
import { useLocation } from "react-router-dom"

const TABS = [
  "Overview",
  "Economy", 
  "Military",
  "Agriculture",
  "Technology"
] as const

interface ResultsTabsProps {
  selectedRegion: string | null
  currentYear: number
  currentQuery: string
  onScoreUpdate: (score: number) => void
  initialData: { content: TabData }
}

interface TabData {
  [key: string]: {
    Global?: TabContent
    [region: string]: TabContent | undefined
  }
}

export function ResultsTabs({ selectedRegion, currentYear, currentQuery, onScoreUpdate, initialData }: ResultsTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(TABS[0])
  const [content, setContent] = useState<TabData>(initialData.content)

  const getContent = (tab: string): TabContent => {
    const tabContent = content[tab] || {}
    const normalizedRegion = selectedRegion?.replace(/_/g, ' ')
    const regionData = selectedRegion ? tabContent[normalizedRegion] : tabContent.Global
    
    return regionData || { 
      text: selectedRegion ? "No regional data available" : "Global data not available",
      score: 0
    }
  }

  return (
    <Tabs defaultValue={TABS[0]} value={activeTab} onValueChange={setActiveTab} className="h-full">
      <div className="flex flex-col h-full">
        <TabsList className="h-12 w-full justify-start rounded-none bg-transparent border-b border-white/10">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1 relative">
          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab} className="absolute inset-0 h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <motion.div
                    className="prose prose-invert max-w-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getContent(tab).text}
                  </motion.div>
                  {tab !== "Future Events" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Timeline Score</span>
                        <motion.span
                          key={getContent(tab).score}
                          className="text-sm font-medium bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"
                        >
                          {selectedRegion ? `${getContent(tab).score}%` : `Global Score: ${getContent(tab).score}%`}
                        </motion.span>
                      </div>
                      <Progress value={getContent(tab).score} className="h-1.5" />
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </div>
    </Tabs>
  )
}

