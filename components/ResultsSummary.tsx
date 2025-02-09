"use client"

const tabs = ["Overview", "Economy", "Military", "Agriculture", "Technology"];

interface ResultsSummaryProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  summaryData: ProcessedTimelineData
  selectedRegion?: string
}

export function ResultsSummary({ selectedTab, setSelectedTab, summaryData, selectedRegion }: ResultsSummaryProps) {
  return (
    <div className="h-1/5 bg-muted p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-white mb-4">Results Summary</h2>
      <nav className="flex space-x-2 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab.toLowerCase())}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedTab === tab.toLowerCase()
                ? "bg-[rgb(var(--accent))] text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
      <div className="text-gray-300">
        {selectedRegion ? (
          <>
            <h3 className="text-lg font-semibold mb-2">{selectedRegion} - {selectedTab}</h3>
            <p>{summaryData.content[selectedTab]?.[selectedRegion]?.text || "No regional data"}</p>
            <div className="mt-2 text-sm text-accent">
              {selectedTab} Score: {summaryData.content[selectedTab]?.[selectedRegion]?.score || 0}%
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Global {selectedTab}</h3>
            <p>{summaryData?.content[selectedTab]?.Global?.text || "No data available"}</p>
            <div className="mt-2 text-sm text-accent">
              {selectedTab} Score: {summaryData?.content[selectedTab]?.Global?.score || 0}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

