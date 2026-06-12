import type { Request, Response } from "express";
import { generateClassDesign } from "../services/designAgent.js";
import { generateFakeProject } from "../services/fakeAgentService.js";
import { generateRequirements } from "../services/requirementsAgent.js";
import { generateJavaCode } from "../services/codeAgent.js";

export async function generateProject(req: Request, res: Response) {
  const idea = req.body.idea;

  if (!idea || !idea.trim()) {
    return res.status(400).json({
      message: "Project idea is required.",
    });
  }

  try {
    const requirements = await generateRequirements(idea);
    const classes = await generateClassDesign(idea, requirements);
    const code = await generateJavaCode(idea, requirements, classes);
    const generatedProject = generateFakeProject(
      idea,
      requirements,
      classes,
      code,
    );

    return res.json(generatedProject);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "AgentForge could not generate the project plan.",
    });
  }
}
