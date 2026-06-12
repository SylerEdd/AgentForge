import OpenAI from "openai";
import { env } from "../config/env.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateJavaCode(
  idea: string,
  requirements: string[],
  classes: string[],
): Promise<string> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Java Developer Agent. Generate simple beginner friendly Java code based on the project idea, requirements, and class design. Return only plain Java code. Do not use markdown code fences.",
    input: `Project idea: ${idea}
        Requirements: ${requirements.map((requirement) => `- ${requirement}`).join("\n")}
        Classes: ${classes.map((className) => `- ${className}`).join("\n")}`,
  });

  const code = response.output_text.trim();

  if (!code) {
    throw new Error("AI response did not include Java Code");
  }

  return code;
}
