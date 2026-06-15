import OpenAI from "openai";
import { env } from "../config/env.js";
import type { GeneratedFile } from "../types/generatedProject.js";
import { parseGeneratedFilesResponse } from "../utils/parseGeneratedFilesResponse.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateJUnitTests(
  idea: string,
  requirements: string[],
  classes: string[],
  sourceFiles: GeneratedFile[],
): Promise<GeneratedFile[]> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Java Testing Agent. Generate beginner-friendly JUnit 5 test files for the provided Java source files. Return only a valid JSON array. Each item must have fileName and content. fileName must end with .java. Do not include markdown or explanations.",
    input: `
Project idea:
${idea}

Requirements:
${requirements.map((requirement) => `- ${requirement}`).join("\n")}

Classes:
${classes.map((className) => `- ${className}`).join("\n")}

Java source files:
${sourceFiles
  .map((file) => `File: ${file.fileName}\n${file.content}`)
  .join("\n\n")}
`,
  });

  return parseGeneratedFilesResponse(response.output_text, "Test Agent");
}
