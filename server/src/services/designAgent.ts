import OpenAI from "openai";
import { env } from "../config/env.js";
import { parseJsonArrayResponse } from "../utils/parseJsonArrayResponse.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateClassDesign(
  idea: string,
  requirements: string[],
): Promise<string[]> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Software Architect Agent. Return only a valid JSON array of 1 to 5 Java class names as strings. Do not include code fences. Do not include any explanations.",
    input: `Project idea: ${idea} 
        Requirements: ${requirements.map((requirement) => `- ${requirement}`).join("\n")}`,
  });

  return parseJsonArrayResponse(response.output_text, "Design Agent");
}
