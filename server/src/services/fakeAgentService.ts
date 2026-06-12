export function generateFakeProject(
  idea: string,
  requirements: string[],
  classes: string[],
) {
  return {
    requirements,
    classes,
    code: `public class BankAccount {
    private double balance;

    public BankAccount(double openingBalance) {
        this.balance = openingBalance;
    }

    public double getBalance() {
        return balance;
    }
}`,
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
