import { 
  combineSimulationInputs,
  buildHistoricalContextChain,
  runSimulation,
  parseSimulationOutput,
  generateAgentIdentity,
  chatWithUser,
  SimulationResult
} from "./chains";

export class Backend {
  private historyDict: Map<string, SimulationResult> = new Map();
  private currentYear: string | null = null;
  private latestSimulationResult: SimulationResult | null = null;

  async simulateYear(
    year: string,
    currentEvent?: string,
    userDecision?: string
  ): Promise<SimulationResult> {
    const result = await runSimulation(
      year,
      currentEvent || "The world stands on the brink of change...", 
      userDecision || "No decision made yet."
    );

    this.historyDict.set(year, result);
    this.currentYear = year;
    
    return result;
  }

  async getEventsByYear(year: string): Promise<Record<string, string[]>> {
    const result = this.historyDict.get(year);
    if (!result) throw new Error("No simulation result available");
    
    const eventsByRegion: Record<string, string[]> = {};
    for (const event of result.future_events) {
      const region = event.location || "Unknown";
      eventsByRegion[region] = eventsByRegion[region] || [];
      eventsByRegion[region].push(event.event_description);
    }
    return eventsByRegion;
  }

  async chatWithAgent(region: string, message: string): Promise<string> {
    if (!this.currentYear) throw new Error("No active simulation year");
    
    const identity = generateAgentIdentity(region);
    const quantities = latestSimulationResult?.regional_quantities?.[region];
    const regionalContext = quantities ? 
      `Quantities: ${JSON.stringify(quantities)}` : 
      "No regional data available";

    return chatWithUser(
      this.currentYear,
      region,
      message,
      regionalContext,
      identity
    );
  }
} 