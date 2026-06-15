import OpenAI from "openai";
import { env } from "../config/env.js";
import type { GeneratedFile } from "../types/generatedProject.js";
import { parseGeneratedFilesResponse } from "../utils/parseGeneratedFilesResponse.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateJavaCode(
  idea: string,
  requirements: string[],
  classes: string[],
): Promise<GeneratedFile[]> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Java Developer Agent. Generate beginner-friendly Java source files based on the project idea, requirements, and class design. Return only a valid JSON array. Each item must have fileName and content. fileName must end with .java. Do not include markdown or explanations.",
    input: `
Project idea:
${idea}

Requirements:
${requirements.map((requirement) => `- ${requirement}`).join("\n")}

Classes:
${classes.map((className) => `- ${className}`).join("\n")}
`,
  });

  return parseGeneratedFilesResponse(response.output_text, "Code Agent");
}
