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

export async function deleteProject(projectId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not delete project.");
  }
}

export async function downloadProject(
  projectId: string,
  idea: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/projects/${projectId}/download`);

  if (!response.ok) {
    throw new Error("Could not download project.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = createSafeFileName(idea);
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function createSafeFileName(idea: string): string {
  const name = idea
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);

  return `${name || "agentforge-project"}.zip`;
}
