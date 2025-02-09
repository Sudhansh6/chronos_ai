import { MOCK_DATA2 } from "../backend_ts/mockData"
import { Backend } from "../backend_ts/backendMain";
const backend = new Backend();

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
  future_events: Array<{  // Changed to array format
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

export class ApiService {
  private useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  private async mockFetch<T>(data: T): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY))
    return data
  }

  private processTimelineData(result: any): ProcessedTimelineData {
    const normalizeRegion = (region: string) => {
      if (region.toLowerCase() === 'global') return 'Global';
      return region
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    // Process future events with proper location handling
    const futureEvents = result.future_events.reduce((acc, event) => {
      const region = normalizeRegion(event.location);
      acc[region] = acc[region] || [];
      acc[region].push(`${event.time}: ${event.event_description}`);
      return acc;
    }, {} as Record<string, string[]>);

    const processedFutureEvents = Object.entries(futureEvents).reduce((acc, [region, events]) => {
      acc[region] = {
        text: events.join('\n'),
        score: 0
      };
      return acc;
    }, {} as Record<string, RegionData>);

    // Process regional quantities with proper casing
    const regionalQuantities = Object.entries(result.regional_quantities).reduce((acc, [region, scores]) => {
      acc[normalizeRegion(region)] = scores as Record<string, number>;
      return acc;
    }, {} as Record<string, Record<string, number>>);

    // Calculate scores with proper region matching
    return {
      content: {
        "Overview": Object.entries(result.global_story).reduce((acc, [region, text]) => {
          const normalizedRegion = normalizeRegion(region);
          const quantities = regionalQuantities[normalizedRegion] || {};
          
          acc[normalizedRegion] = {
            text: text as string,
            score: Math.round(Object.values(quantities).reduce((a, b) => a + b, 0) / Object.values(quantities).length || 0)
          };
          return acc;
        }, {} as Record<string, RegionData>),
        "Economy": this.processCategory(regionalQuantities, 'economy', this.getEconomicDescription),
        "Military": this.processCategory(regionalQuantities, 'military', this.getMilitaryDescription),
        "Agriculture": this.processCategory(regionalQuantities, 'agriculture', this.getAgricultureDescription),
        "Technology": this.processCategory(regionalQuantities, 'technology', this.getTechDescription),
        "Future Events": processedFutureEvents
      },
      totalScore: Object.values(regionalQuantities).reduce((total, region) => {
        const regionTotal = Object.values(region).reduce((sum, val) => sum + val, 0);
        return total + (regionTotal / Object.values(region).length);
      }, 0) / Object.keys(regionalQuantities).length
    };
  }

  async getTimelineData(params: Timeline): Promise<ProcessedTimelineData> {
    if (this.useMockData) {
      console.log(this.processTimelineData(MOCK_DATA2));
      return this.mockFetch(this.processTimelineData(MOCK_DATA2));
    }

    try {
      const result = await backend.simulateYear(
        params.year.toString(),
        undefined,
        params.query
      );
      console.log("Fetched", result);
      const processedData = this.processTimelineData(result);
      console.log("Processed timeline data:", processedData);
      return processedData;
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      return this.processTimelineData(MOCK_DATA2);
    }
  }

  async getChatResponse(message: string, region: string | null, timeline: Timeline): Promise<string> {
    try {
      return await backend.chatWithAgent(region || "Global", message);
    } catch (error) {
      console.error("Error fetching chat response:", error);
      throw new Error("Failed to fetch chat response");
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

