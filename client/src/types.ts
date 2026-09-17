export type GeneratedFile = {
  fileName: string;
  content: string;
};

export type SavedProject = {
  id: string;
  idea: string;
  requirements: string[];
  classes: string[];
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
  createdAt: string;
};

export type TestRun = {
  id: string;
  projectId: string;
  success: boolean;
  output: string;
  createdAt: string;
};

export type ProjectRevision = {
  id: string;
  projectId: string;
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
  changeSummary: string[];
  version: number;
  createdAt: string;
};

export type ApplyFixesResponse = {
  project: SavedProject;
  revision: ProjectRevision;
  changeSummary: string[];
};
