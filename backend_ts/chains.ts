import { llm } from "./llmFactory";
import { 
  historicalContextPrompt,
  storyPrompt,
  reasoningPrompt,
  chatAgentPrompt
} from "./prompts";
import { randomChoice } from "./utils";

interface SimulationChain {
  run(params: {
    combined: string;
    historical_context: string;
  }): Promise<{
    simulation_output: string;
    refined_output?: string;
  }>;
}

let statefulSimulationChain: SimulationChain | null = null;
let latestSimulationResult: any = null;

export interface SimulationResult {
  global_story: Record<string, string>;
  chain_of_thought: string[];
  future_events: Array<{
    time: string;
    location: string;
    event_description: string;
  }>;
  regional_quantities: Record<string, Record<string, number>>;
}

export function combineSimulationInputs(
  year: string,
  historicalContext: string,
  currentEvent: string,
  userDecision: string
): string {
  return [
    `Year: ${year}`,
    `Historical Context: ${historicalContext}`,
    `Current Event: ${currentEvent}`,
    `User Decision: ${userDecision}`
  ].join("\n\n");
}

export async function buildHistoricalContextChain(year: string): Promise<string> {
  const response = await llm.generateResponse({
    systemPrompt: "You are a historical context expert",
    userInput: historicalContextPrompt.replace("{year}", year)
  });
  return response;
}

function buildSimulationChain(): SimulationChain {
  if (statefulSimulationChain) return statefulSimulationChain;

  const simulationChain: SimulationChain = {
    async run({ combined, historical_context }) {
      // Story generation
      const storyOutput = await llm.generateResponse({
        systemPrompt: storyPrompt,
        userInput: combined
      });

      // Reasoning/editing
      const reasoningOutput = await llm.generateResponse({
        systemPrompt: reasoningPrompt,
        userInput: storyOutput
      });

      return {
        simulation_output: storyOutput,
        refined_output: reasoningOutput
      };
    }
  };

  statefulSimulationChain = simulationChain;
  return simulationChain;
}

export async function runSimulation(
  year: string,
  currentEvent: string,
  userDecision: string
): Promise<SimulationResult> {
  const historicalContext = await buildHistoricalContextChain(year);
  const combinedInput = combineSimulationInputs(year, historicalContext, currentEvent, userDecision);
  
  const chain = buildSimulationChain();
  const result = await chain.run({
    combined: combinedInput,
    historical_context: historicalContext
  });

  const parsedResult = parseSimulationOutput(result.simulation_output);
  latestSimulationResult = parsedResult;
  return parsedResult;
}

export function parseSimulationOutput(output: string): SimulationResult {
  const cleanedOutput = output.replace(/```json/g, "").replace(/```/g, "").trim();
  const result = JSON.parse(cleanedOutput);
  
  // Validate required keys
  const requiredKeys = ["global_story", "chain_of_thought", "future_events", "regional_quantities"];
  requiredKeys.forEach(key => {
    if (!(key in result)) throw new Error(`Missing required key: ${key}`);
  });

  return result as SimulationResult;
}

export function generateAgentIdentity(region: string): {
  profession: string;
  socialClass: string;
  famousIntro: string;
  isFamous: boolean;
} {
  const isFamous = Math.random() < 0.5;
  const professions = ["merchant", "farmer", "blacksmith", "scribe", "artisan"];
  const socialClasses = ["working-class", "middle-class", "commoner"];
  
  return {
    profession: isFamous ? "renowned scholar" : randomChoice(professions),
    socialClass: isFamous ? "elite" : randomChoice(socialClasses),
    famousIntro: isFamous ? 
      "You are recognized as a celebrated figure of your time in your region." : "",
    isFamous
  };
}

export async function chatWithUser(
  year: string,
  region: string,
  message: string,
  regionalContext: string,
  identity: ReturnType<typeof generateAgentIdentity>
): Promise<string> {
  const response = await llm.generateResponse({
    systemPrompt: chatAgentPrompt
      .replace("{year}", year)
      .replace("{region}", region)
      .replace("{regional_context}", regionalContext)
      .replace("{profession}", identity.profession)
      .replace("{social_class}", identity.socialClass)
      .replace("{famous_intro}", identity.famousIntro),
    userInput: message
  });

  return response.replace(/```/g, "").trim();
}
