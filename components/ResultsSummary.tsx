"use client"

const tabs = ["Overview", "Religion", "Economy", "Population", "Myths", "Upcoming Events", "Geopolitics"]

interface ResultsSummaryProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  summary: string
}

export function ResultsSummary({ selectedTab, setSelectedTab, summary }: ResultsSummaryProps) {
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
        {summary || "This is where the summary of the alternate timeline results would be displayed."}
      </div>
    </div>
  )
}

