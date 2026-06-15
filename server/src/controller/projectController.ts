import type { Request, Response } from "express";
import { generateClassDesign } from "../services/designAgent.js";
import { assembleGeneratedProject } from "../services/projectAssembler.js";
import { generateRequirements } from "../services/requirementsAgent.js";
import { generateJavaCode } from "../services/codeAgent.js";
import { generateJUnitTests } from "../services/testAgent.js";
import { generateReviewNotes } from "../services/reviewAgent.js";
import {
  getAllProjects,
  getProjectById,
  saveGeneratedProject,
} from "../services/projectHistoryService.js";

export async function generateProject(req: Request, res: Response) {
  const idea = req.body.idea;

  if (!idea || !idea.trim()) {
    return res.status(400).json({
      message: "Project idea is required.",
    });
  }

  try {
    console.log("Running Requirements Agent...");
    const requirements = await generateRequirements(idea);

    console.log("Running Design Agent...");
    const classes = await generateClassDesign(idea, requirements);

    console.log("Running Code Agent...");
    const sourceFiles = await generateJavaCode(idea, requirements, classes);

    console.log("Running Test Agent...");
    const testFiles = await generateJUnitTests(
      idea,
      requirements,
      classes,
      sourceFiles,
    );

    console.log("Running Reviewer Agent...");
    const review = await generateReviewNotes(
      idea,
      requirements,
      classes,
      sourceFiles,
      testFiles,
    );

    console.log("Saving generated project...");
    const savedProject = await saveGeneratedProject({
      idea,
      requirements,
      classes,
      sourceFiles,
      testFiles,
      review,
    });

    return res.json(savedProject);
  } catch (error) {
    console.error("AgentForge workflow failed:", error);

    return res.status(500).json({
      message: "AgentForge failed while running the AI workflow.",
    });
  }
}

export async function getProjects(req: Request, res: Response) {
  const projects = await getAllProjects();

  return res.json(projects);
}

export async function getProject(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Project id is required and must be a single string.",
    });
  }

  const project = await getProjectById(id);

  if (!project) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  return res.json(project);
}
