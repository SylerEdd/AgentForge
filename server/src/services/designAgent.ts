import OpenAI from "openai";
import { env } from "../config/env.js";

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
      "You are a Software Architect Agent. Based on the project idea and requirements, return only a JSON array of Java class names. Return 1 to 5 class names. Do not include explanations.",
    input: `Project idea: ${idea} 
        Requirements: ${requirements.map((requirement) => `- ${requirement}`).join("\n")}`,
  });

  const text = response.output_text;
  const classes = JSON.parse(text);

  if (!Array.isArray(classes)) {
    throw new Error("AI response was not a class design array");
  }

  return classes;
}
