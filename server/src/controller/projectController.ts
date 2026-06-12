import type { Request, Response } from "express";
import { generateRequirements } from "../services/requirementsAgent.js";
import { generateFakeProject } from "../services/fakeAgentService.js";

export async function generateProject(req: Request, res: Response) {
  const idea = req.body.idea;

  if (!idea || !idea.trim()) {
    return res.status(400).json({
      message: "Project idea is required.",
    });
  }

  try {
    const requirements = await generateRequirements(idea);
    const generatedProject = generateFakeProject(idea, requirements);

    return res.json(generatedProject);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "AgentForge could not generate requirements.",
    });
  }
}
