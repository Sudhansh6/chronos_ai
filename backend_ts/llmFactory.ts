import { CreateMLCEngine, MLCEngineInterface, MLCEngineWorkerHandler } from "@mlc-ai/web-llm";

interface LLMProvider {
  generateResponse(params: {
    systemPrompt: string;
    userInput: string;
    temperature?: number;
  }): Promise<string>;
}

// WebLLM implementation
const webllmProvider: LLMProvider = {
  async generateResponse({ systemPrompt, userInput, temperature = 0.7 }) {
    const engine: MLCEngineInterface = await CreateMLCEngine(
      "mlc-ai/SmolLM2-135M-Instruct-q4f16_1-MLC",
      { 
        initProgressCallback: (report) => {
          console.log(`WebLLM loading: ${report.progress}%`);
        }
      }
    );

    // Load the model first time
    await engine.reload("mlc-ai/SmolLM2-135M-Instruct-q4f16_1-MLC");
    
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

const openaiProvider: LLMProvider = {
  async generateResponse({ systemPrompt, userInput, temperature = 0.7 }) {
    const { Configuration, OpenAIApi } = require("openai");
    const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(config);

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ]
    });

    return response.data.choices[0].message?.content || "";
  }
};

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
