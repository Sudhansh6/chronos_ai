import { Suspense } from "react"
import ResultsContent from "./results-content"

export default function Results() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="text-white">Loading timeline data...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}

