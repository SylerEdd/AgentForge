export type GeneratedFile = {
  fileName: string;
  content: string;
};

export type GeneratedProject = {
  requirements: string[];
  classes: string[];
  sourceFiles: GeneratedFile[];
  testFiles: GeneratedFile[];
  review: string[];
};

export type TestRunResult = {
  success: boolean;
  output: string;
};
