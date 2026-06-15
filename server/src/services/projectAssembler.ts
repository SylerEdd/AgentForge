// take all agent outputs and combine them into one response object
import type { GeneratedFile } from "../types/generatedProject.js";

export function assembleGeneratedProject(
  requirements: string[],
  classes: string[],
  sourceFiles: GeneratedFile[],
  testFiles: GeneratedFile[],
  review: string[],
) {
  return {
    requirements,
    classes,
    sourceFiles,
    testFiles,
    review,
  };
}
