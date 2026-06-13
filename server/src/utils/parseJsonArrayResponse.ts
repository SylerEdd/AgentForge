import { cleanJsonResponse } from "./cleanJsonResponse.js";

export function parseJsonArrayResponse(text: string, label: string): string[] {
  const cleanedText = cleanJsonResponse(text);
  const parsed = JSON.parse(cleanedText);

  if (!Array.isArray(parsed)) {
    throw new Error(`${label} response was not a JSON array.`);
  }

  const allItemsAreStrings = parsed.every((item) => typeof item === "string");

  if (!allItemsAreStrings) {
    throw new Error(`${label} response contained non-string items.`);
  }

  return parsed;
}
