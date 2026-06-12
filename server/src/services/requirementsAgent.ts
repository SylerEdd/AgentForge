import OpenAI from "openai";
import { env } from "../config/env.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateRequirements(idea: string): Promise<string[]> {
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Product Manager Agent. Turn the user's Java project idea into 4 to 6 clear beginner friendly software requirements. Return only a JSON array of strings.",
    input: `Project idea: ${idea}`,
  });

  const text = response.output_text;
  const requirements = JSON.parse(text);

  if (!Array.isArray(requirements)) {
    throw new Error("AI response was not a requirements array");
  }

  return requirements;
}
