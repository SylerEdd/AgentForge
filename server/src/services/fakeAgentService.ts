export function generateFakeProject(idea: string) {
  return {
    requirements: [
      `Build a small Java solution for: ${idea}`,
      "Allow money to be deposited into an account",
      "Allow money to be withdrawn from an account",
      "Prevent the balance from going below zero",
    ],
    classes: ["BankAccount"],
    code: `public class BankAccount{
        private double balance;
        
        public BankAccount(double openingBalance){
        this.balance = openingBalance;
    }
        public double getBalance(){
        return balance;
        }
        }`,
    test: `class BankAccountTest{
        // JUnit test will go here}`,
    review: [
      "Add valdation for negative deposits.",
      "Add validation for withdrawing more than the current balance.",
      "Add test for edge cases.",
    ],
  };
}
