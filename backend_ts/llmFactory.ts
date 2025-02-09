import { CreateMLCEngine, MLCEngineInterface, MLCEngineWorkerHandler } from "@mlc-ai/web-llm";
import { OpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Define the model name as a constant
const MODEL_NAME = "RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC";

interface LLMProvider {
  generateResponse(params: {
    systemPrompt: string;
    userInput: string;
    temperature?: number;
  }): Promise<string>;
}

// Create an OpenAI instance as per the official LangChain JS usage.
const openaiLLM = new OpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI provider using LangChain official usage.
const openaiProvider: LLMProvider = {
  async generateResponse({ systemPrompt, userInput, temperature = 0.7 }) {
    // Combine system prompt and user input
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["user", "{input}"],
    ]);

    // Format the template with the provided user input.
    const prompt = await promptTemplate.format({ input: userInput });
    
    // Call the OpenAI instance using the official syntax.
    const response = await openaiLLM.invoke(prompt);
    return response.trim();
  },
};

// WebLLM implementation
const webllmProvider: LLMProvider = {
  async generateResponse({ systemPrompt, userInput, temperature = 0.7 }) {
    const engine: MLCEngineInterface = await CreateMLCEngine(MODEL_NAME, { 
      initProgressCallback: (report) => {
        console.log(`WebLLM loading: ${report.progress}%`);
      }
    });

    // Load the model first time
    await engine.reload(MODEL_NAME);
    
    const response = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ],
      temperature: temperature,
      stream: false
    });

    return response.choices[0].message.content || "";
  }
};

// Keep other providers commented but available

// const anthropicProvider: LLMProvider = {
//   async generateResponse({ systemPrompt, userInput, temperature = 0.7 }) {
//     const { Anthropic } = require("@anthropic-ai/sdk");
//     const anthropic = new Anthropic(process.env.ANTHROPIC_API_KEY);
    
//     const response = await anthropic.messages.create({
//       model: "claude-3-opus-20240229",
//       max_tokens: 1000,
//       temperature,
//       system: systemPrompt,
//       messages: [{ role: "user", content: userInput }]
//     });

//     return response.content[0].text;
//   }
// };

export const llm: LLMProvider = openaiProvider;
