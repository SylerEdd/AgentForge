import type { Request, Response } from "express";
import { generateFakeProject } from "../services/fakeAgentService.js";

export function generateProject(req: Request, res: Response) {
  const idea = req.body.idea; // expects { "idea": "some project idea" } in the request body

  if (!idea || !idea.trim()) {
    //checks if the idea is empty
    return res.status(400).json({
      message: "Project idea is required.", // returns a 400 Bad Request if the idea is missing or empty
    });
  }

  const generatedProject = generateFakeProject(idea); // calls the service function to generate a project based on the provided idea

  return res.json(generatedProject); // returns the generated project as a JSON response
}
