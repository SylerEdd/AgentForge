import { cleanJsonResponse } from "./cleanJsonResponse.js";
import type { GeneratedFile } from "../types/generatedProject.js";

export function parseGeneratedFilesResponse(
  text: string,
  label: string,
): GeneratedFile[] {
  const cleanedText = cleanJsonResponse(text);
  const parsed = JSON.parse(cleanedText);

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} response was not a JSON array.`);
  }

  for (const item of parsed) {
    const hasValidFileName =
      typeof item === "object" &&
      item !== null &&
      typeof item.fileName === "string" &&
      item.fileName.trim().endsWith(".java");

    const hasValidContent =
      typeof item === "object" &&
      item !== null &&
      typeof item.content === "string" &&
      item.content.trim().length > 0;

    if (!hasValidFileName || !hasValidContent) {
      throw new Error(`${label} response contained an invalid generated file.`);
    }
  }

  return parsed;
}
