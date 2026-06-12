import OpenAI from "openai";
import { env } from "../config/env.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateJUnitTests(
  idea: string,
  requirements: string[],
  classes: string[],
  code: string,
): Promise<string> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Java Testing Agent. Generate beginner friendly JUnit 5 tests for the provided Java code. Return only plain test code. Do not use markdown code fences.",
    input: `Project idea: ${idea}
        Requirements: ${requirements.map((requirement) => `- ${requirement}`).join("\n")}
        Classes: ${classes.map((className) => `- ${className}`).join("\n")}
        Java code: ${code}`,
  });

  const tests = response.output_text.trim();

  if (!tests) {
    throw new Error("AI response did not include JUnit tests");
  }

  return tests;
}
