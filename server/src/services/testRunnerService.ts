import type { TestRunResult } from "../types/generatedProject.js";

export async function runGeneratedProjectTests(): Promise<TestRunResult> {
  return {
    success: false,
    output: "Test",
  };
}
