export function generateFakeProject(
  requirements: string[],
  classes: string[],
  code: string,
  tests: string,
) {
  return {
    requirements,
    classes,
    code,
    tests,
    review: [
      "Add validation for negative deposits.",
      "Add validation for withdrawing more than the current balance.",
      "Add tests for edge cases.",
    ],
  };
}
