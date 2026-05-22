import cors from "cors";
import express from "express";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/projects/generate", (req, res) => {
  const idea = req.body.idea;

  if (!idea || !idea.trim()) {
    return res.status(400).json({
      message: "Project idea is required.",
    });
  }

  res.json({
    requirements: [
      "The system should store account balance",
      "The user should be able to deposit money",
      "The user should be able to withdraw money",
      "The balance should not go below zero",
    ],
    classes: ["BankAccount"],
    code: "public class BankAccount {\n private double balance;\n}",
    tests: "class bankAccountTest {\n // tests will go here\n}",
    review: [
      "Add validation for negative deposits",
      "Add validation for withdrawing more than the balance",
    ],
  });
});

app.listen(port, () => {
  console.log(`AgentForge server is running at http://localhost:${port}`);
});
