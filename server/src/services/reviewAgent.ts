import OpenAI from "openai";
import { env } from "../config/env.js";
import { cleanJsonResponse } from "../utils/cleanJsonResponse.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateReviewNotes(
  idea: string,
  requirements: string[],
  classes: string[],
  code: string,
  tests: string,
): Promise<string[]> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Java Code Reviewer Agent. Return only a valid JSON array of 4 to 6 strings. Do not include explanations outside the JSON array. Each string should be a short review note about bugs, missing validations, design improvements, or missing tests",
    input: `Project idea: ${idea}
        Requirements: ${requirements.map((requirement) => `- ${requirement}`).join("\n")}
        Classes: ${classes.map((className) => `- ${className}`).join("\n")}
        Java code: ${code}
        JUnit tests: ${tests}`,
  });

  const text = cleanJsonResponse(response.output_text);
  console.log("Raw response:", text);
  const reviewNotes = JSON.parse(text);

  if (!Array.isArray(reviewNotes)) {
    throw new Error("AI response was not a review notes array.");
  }

  return reviewNotes;
}
