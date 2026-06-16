import type { SavedProject, TestRun } from "../types";

const API_URL = "http://localhost:4000";

export async function fetchProjects(): Promise<SavedProject[]> {
  const response = await fetch(`${API_URL}/api/projects`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load project history.");
  }

  return data;
}

export async function generateProject(idea: string): Promise<SavedProject> {
  const response = await fetch(`${API_URL}/api/projects/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not generate project.");
  }

  return data;
}

export async function runProjectTests(projectId: string): Promise<TestRun> {
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/run-tests`,
    {
      method: "POST",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not run tests.");
  }

  return data;
}

export async function fetchProjectTestRuns(
  projectId: string,
): Promise<TestRun[]> {
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/test-runs`,
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not load test runs.");
  }

  return data;
}
