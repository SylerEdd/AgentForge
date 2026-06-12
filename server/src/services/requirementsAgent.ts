import OpenAI from "openai";
import { env } from "../config/env.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateRequirements(idea: string): Promise<string[]> {
  // checks if the API key exists before making the API call to avoid unnecessary calls and provide a clearer error message
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  //sends a request to OpenAI
  const response = await client.responses.create({
    // tells the AI to use which model to generate the response
    model: env.openAiModel,
    // provides the AI with instructions of who it is and what it should do
    instructions:
      "You are a Product Manager Agent. Turn the user's Java project idea into 4 to 6 clear beginner friendly software requirements. Return only a JSON array of strings.",
    // provides the AI with the user's input
    input: `Project idea: ${idea}`,
  });

  // OpenAI returns a full response object
  const text = response.output_text;
  // this converts the AI text into real JavaScript data that we can work with
  const requirements = JSON.parse(text);

  // checks if the AI returned an array of requirements as expected, if not it throws an error
  if (!Array.isArray(requirements)) {
    throw new Error("AI response was not a requirements array");
  }

  return requirements;
}
