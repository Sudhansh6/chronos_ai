import { MOCK_CONTENT } from "@/lib/mock-data"

const MOCK_API_DELAY = 800 // Simulate network delay

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export interface Timeline {
  year: number
  query: string
}

export interface TabContent {
  text: string
  score: number
}

export interface TimelineData {
  content: Record<string, Record<string, TabContent>>
  totalScore: number
}

class ApiService {
  private async mockFetch<T>(data: T): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))
    return data
  }

  async getTimelineData(timeline: Timeline, region: string | null): Promise<TimelineData> {
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/timeline/${timeline.year}?query=${timeline.query}&region=${region}`)
      // return response.json()

      return this.mockFetch({
        content: MOCK_CONTENT,
        totalScore:
          Object.values(MOCK_CONTENT).reduce((sum, category) => {
            const content = region && region in category ? category[region] : category.default || category.global
            return sum + (content?.score || 0)
          }, 0) / Object.keys(MOCK_CONTENT).length,
      })
    } catch (error) {
      console.error("Error fetching timeline data:", error)
      throw new Error("Failed to fetch timeline data")
    }
  }

  async getChatResponse(message: string, region: string | null, timeline: Timeline): Promise<string> {
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/chat`, {
      //   method: 'POST',
      //   body: JSON.stringify({ message, region, timeline })
      // })
      // return response.json()

      const responses = region
        ? [
            `In ${region}, during ${timeline.year}, ${message}`,
            `The alternate timeline shows significant changes in ${region}...`,
            `${region}'s development took a fascinating turn in ${timeline.year}...`,
          ]
        : [
            `In this global timeline of ${timeline.year}, ${message}`,
            `The world evolved differently when ${timeline.query}...`,
            `This alternate path led to fascinating changes...`,
          ]

      return this.mockFetch(responses[Math.floor(Math.random() * responses.length)])
    } catch (error) {
      console.error("Error fetching chat response:", error)
      throw new Error("Failed to fetch chat response")
    }
  }

  async getTimelineSuggestions(query: string): Promise<string[]> {
    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/suggestions?query=${query}`)
      // return response.json()

      const suggestions = [
        "What if the Industrial Revolution happened earlier?",
        "What if the Renaissance spread to different regions?",
        "What if ancient civilizations had modern technology?",
        "What if different trade routes dominated history?",
        "What if key historical figures made different choices?",
      ]

      const filtered = query ? suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase())) : suggestions

      return this.mockFetch(filtered)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      throw new Error("Failed to fetch suggestions")
    }
  }
}

export const api = new ApiService()

