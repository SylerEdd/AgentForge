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

export type TestRunResult = {
  success: boolean;
  output: string;
};
