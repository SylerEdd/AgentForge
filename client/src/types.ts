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
