// take all agent outputs and combine them into one response object
export function assembleGeneratedProject(
  requirements: string[],
  classes: string[],
  code: string,
  tests: string,
  review: string[],
) {
  return {
    requirements,
    classes,
    code,
    tests,
    review,
  };
}
