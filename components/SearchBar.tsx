"use client"

import { useState, useEffect, type React, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Globe } from "lucide-react"
import { api } from "@/lib/api"

export function SearchBar() {
  const [pivotalYear, setPivotalYear] = useState(1800)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const abortControllerRef = useRef<AbortController>()

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setIsLoading(true)
        
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        const data = await api.getTimelineSuggestions(query, {
          signal: abortControllerRef.current.signal
        })
        setSuggestions(data)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Error fetching suggestions:", error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if query has changed and not empty
    if (query.trim()) {
      const debounce = setTimeout(fetchSuggestions, 300)
      return () => {
        clearTimeout(debounce)
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
      }
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim() || pivotalYear) {
      router.push(`/results?year=${pivotalYear}&query=${encodeURIComponent(query || "default query")}`)
    }
  }

  const createRipple = (event: React.MouseEvent<HTMLInputElement>) => {
    const ripple = document.createElement("div")
    ripple.classList.add("blur-ripple")
    document.body.appendChild(ripple)

    const rect = event.currentTarget.getBoundingClientRect()
    const size = 1000
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${event.clientX - size / 2}px`
    ripple.style.top = `${event.clientY - size / 2}px`

    ripple.addEventListener("animationend", () => {
      document.body.removeChild(ripple)
    })
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = Number.parseInt(e.target.value)
    setPivotalYear(newYear)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLInputElement>) => {
    createRipple(e)
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-300">Choose a pivotal moment</label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1000"
            max="2023"
            value={pivotalYear}
            onChange={handleYearChange}
            onMouseMove={handleMouseMove}
            className="w-full cursor-pointer"
          />
          <input
            type="number"
            min="1000"
            max="2023"
            value={pivotalYear}
            onChange={(e) => setPivotalYear(Number(e.target.value))}
            className="w-24 bg-muted text-white rounded-md py-2 px-3 text-center"
          />
        </div>
      </div>
      <div className="space-y-4 relative">
        <label className="block text-sm font-medium text-gray-300">What if...</label>
        <div className="relative">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your alternate history scenario..."
              className="block w-full bg-muted text-white rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <Search className="text-gray-400" />
            </button>
          </form>
        </div>
        {suggestions.length > 0 && !isLoading && (
          <ul className="absolute w-full mt-1 bg-[#1a1a1a] rounded-lg py-2 shadow-xl border border-white/10 z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center px-4 py-2 text-gray-300 hover:text-white cursor-pointer hover:bg-white/5"
                onClick={() => {
                  setQuery(suggestion)
                  handleSearch()
                }}
              >
                <Globe className="mr-3 flex-shrink-0" size={16} />
                <span className="line-clamp-1">{suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

