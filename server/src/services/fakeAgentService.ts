export function generateFakeProject(
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
