import OpenAI from "openai";
import { env } from "../config/env.js";
import type {
  FixerAgentResult,
  GeneratedFile,
} from "../types/generatedProject.js";

const client = new OpenAI({
  apiKey: env.openAiApiKey,
});

type FixProjectInput = {
  idea: string;
  requirements: string[];
  classes: string[];
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
};

export async function fixProjectFiles(
  input: FixProjectInput,
): Promise<FixerAgentResult> {
  if (!env.openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await client.responses.create({
    model: env.openAiModel,
    instructions: `You are the Fixer Agent in an AI software engineering team.
        
        Improve the supplied Java source files and JUnit tests by following the review notes.
        
        Rules:
        - Use Java 17.
        - Use JUnit 5.
        - Fix the problems described in the review notes.
        - Preserve existing working functionality.
        - Keep each file as a separate object.
        - Return complete file contents, not partial code.
        - Do not use Markdown code fences.
        - Return only valid JSON.

        Return this exact JSON structure:
        {
        "sourceFiles":[
        {
        "fileName": "Example.java",
        "content": "complete Java source code"
        }
        ],
        "testFiles":[
        {
        "fileName": "ExampleTest.java",
        "content": "complete JUnit test code"
        }
        ],
        "changeSummary": ["Description of a change"]
        }
        `.trim(),
    input: JSON.stringify(input),
  });

  // fix all the code fences
  const cleanedText = response.output_text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const result: unknown = JSON.parse(cleanedText);

  if (!isFixerAgentResult(result)) {
    throw new Error("wrong result");
  }

  return result;
}

function isFixerAgentResult(value: unknown): value is FixerAgentResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const result = value as Partial<FixerAgentResult>;

  return (
    isGeneratedFileArray(result.sourceFiles) &&
    isGeneratedFileArray(result.testFiles) &&
    Array.isArray(result.changeSummary) &&
    result.changeSummary.every((summary) => typeof summary === "string")
  );
}

function isGeneratedFileArray(value: unknown): value is GeneratedFile[] {
  return (
    Array.isArray(value) &&
    value.every(
      (file) =>
        typeof file === "object" &&
        file !== null &&
        typeof (file as GeneratedFile).fileName === "string" &&
        typeof (file as GeneratedFile).content === "string",
    )
  );
}
