export function generateFakeProject(
  idea: string,
  requirements: string[],
  classes: string[],
  code: string,
) {
  return {
    requirements,
    classes,
    code,
    tests: `class BankAccountTest {
    // JUnit tests will go here
}`,
    review: [
      "Add validation for negative deposits.",
      "Add validation for withdrawing more than the current balance.",
      "Add tests for edge cases.",
    ],
  };
}
