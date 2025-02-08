import { MOCK_CONTENT } from "@/lib/mock-data"

const MOCK_API_DELAY = 800 // Simulate network delay

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface Timeline {
  year: number
  query: string
}

export interface TabContent {
  text: string
  score: number
}

export interface RegionData {
  text: string;
  score: number;
}

export interface TimelineData {
  global_story: Record<string, string>;
  chain_of_thought: string[];
  future_events: Array<{
    time: string;
    location: string;
    event_description: string;
  }>;
  regional_quantities: Record<string, Record<string, number>>;
}

export interface ProcessedTimelineData {
  content: Record<string, Record<string, RegionData>>;
  totalScore: number;
}

class ApiService {
  private async mockFetch<T>(data: T): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))
    return data
  }

  async getTimelineData(timeline: Timeline): Promise<ProcessedTimelineData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/timeline/${timeline.year}?query=${encodeURIComponent(timeline.query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'  // Keep this for all authenticated requests
        }
      );
      const data: TimelineData = await response.json();

      // Process future events by region
      const futureEventsByRegion = data.future_events.reduce((acc, event) => {
        if (!acc[event.location]) acc[event.location] = [];
        acc[event.location].push(event);
        return acc;
      }, {} as Record<string, typeof data.future_events>);

      const processedData: ProcessedTimelineData = {
        content: {
          "Overview": Object.entries(data.global_story).reduce((acc, [region, text]) => {
            acc[region] = {
              text: text,
              score: Math.round(Object.values(data.regional_quantities[region]).reduce((a, b) => a + b, 0) / 4)
            };
            return acc;
          }, {} as Record<string, RegionData>),
          
          "Economy": this.processCategory(data.regional_quantities, 'economy', this.getEconomicDescription),
          "Military": this.processCategory(data.regional_quantities, 'military', this.getMilitaryDescription),
          "Agriculture": this.processCategory(data.regional_quantities, 'agriculture', this.getAgricultureDescription),
          "Technology": this.processCategory(data.regional_quantities, 'technology', this.getTechDescription),
          
          "Future Events": Object.entries(futureEventsByRegion).reduce((acc, [region, events]) => {
            acc[region] = {
              text: events.map(e => `${e.time}: ${e.event_description}`).join('\n'),
              score: 0
            };
            return acc;
          }, {} as Record<string, RegionData>)
        },
        totalScore: Object.values(data.regional_quantities).reduce((total, region) => {
          const regionTotal = Object.values(region).reduce((sum, val) => sum + val, 0);
          return total + (regionTotal / Object.values(region).length);
        }, 0) / Object.keys(data.regional_quantities).length
      };
      console.log(processedData);
      return processedData;
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      throw new Error("Failed to fetch timeline data");
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

  private getEconomicDescription(score: number): string {
    if (score > 80) return "is thriving with advanced industries and trade networks";
    if (score > 60) return "shows steady growth and developing infrastructure";
    return "faces challenges with basic infrastructure and trade";
  }

  private getMilitaryDescription(score: number): string {
    if (score > 80) return "is dominant with advanced weaponry and trained forces";
    if (score > 60) return "maintains adequate defense capabilities";
    return "requires modernization and better organization";
  }

  private getAgricultureDescription(score: number): string {
    if (score > 80) return "is highly productive with surplus food production";
    if (score > 60) return "meets basic needs with some surplus";
    return "struggles to meet population demands";
  }

  private getTechDescription(score: number): string {
    if (score > 80) return "leads in innovation and technological adoption";
    if (score > 60) return "shows promising developments in key areas";
    return "lags behind in technological infrastructure";
  }

  private processCategory(
    quantities: Record<string, Record<string, number>>,
    category: string,
    descFn: (score: number) => string
  ) {
    return Object.entries(quantities).reduce((acc, [region, scores]) => {
      acc[region] = {
        text: `${this.capitalize(category)} in ${region} ${descFn(scores[category])}`,
        score: scores[category]
      };
      return acc;
    }, {} as Record<string, RegionData>);
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export const api = new ApiService()

