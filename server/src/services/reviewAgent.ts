import OpenAI from "openai";
import { env } from "../config/env.js";
import type { GeneratedFile } from "../types/generatedProject.js";
import { parseJsonArrayResponse } from "../utils/parseJsonArrayResponse.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

export async function generateReviewNotes(
  idea: string,
  requirements: string[],
  classes: string[],
  sourceFiles: GeneratedFile[],
  testFiles: GeneratedFile[],
): Promise<string[]> {
  const response = await client.responses.create({
    model: env.openAiModel,
    instructions:
      "You are a Java Code Reviewer Agent. Review the generated Java source files and JUnit test files. Return only a valid JSON array of 4 to 6 short review notes. Do not include markdown or explanations outside the JSON array.",
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

JUnit test files:
${testFiles
  .map((file) => `File: ${file.fileName}\n${file.content}`)
  .join("\n\n")}
`,
  });

  return parseJsonArrayResponse(response.output_text, "Reviewer Agent");
}
