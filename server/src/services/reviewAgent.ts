import OpenAI from "openai";
import { env } from "../config/env.js";
import { parseJsonArrayResponse } from "../utils/parseJsonArrayResponse.js";

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

  return parseJsonArrayResponse(response.output_text, "Reviewer Agent");
}
