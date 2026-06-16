import type { Request, Response } from "express";
import { generateClassDesign } from "../services/designAgent.js";
import { assembleGeneratedProject } from "../services/projectAssembler.js";
import { generateRequirements } from "../services/requirementsAgent.js";
import { generateJavaCode } from "../services/codeAgent.js";
import { generateJUnitTests } from "../services/testAgent.js";
import { generateReviewNotes } from "../services/reviewAgent.js";
import {
  deleteProjectById,
  getAllProjects,
  getProjectById,
  saveGeneratedProject,
} from "../services/projectHistoryService.js";
import { runGeneratedProjectTests } from "../services/testRunnerService.js";
import {
  getTestRunsForProject,
  saveTestRun,
} from "../services/testRunService.js";

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

export async function runProjectTests(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Project id is required and must be a single string.",
    });
  }

  try {
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const result = await runGeneratedProjectTests(project);

    const savedTestRun = await saveTestRun({
      projectId: project.id,
      success: result.success,
      output: result.output,
    });

    return res.json(savedTestRun);
  } catch (error) {
    console.error("Test execution failed:", error);

    return res.status(500).json({
      message: "AgentForge could not run the generated tests.",
    });
  }
}

export async function getProjectTestRuns(req: Request, res: Response) {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      message: "Project id is required and must be a single string.",
    });
  }

  try {
    const project = await getProjectById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found.",
      });
    }

    const testRuns = await getTestRunsForProject(project.id);

    return res.json(testRuns);
  } catch (error) {
    console.error("Could not load test runs:", error);

    return res.status(500).json({
      message: "AgentForge could not load test runs.",
    });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
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

    await deleteProjectById(project.id);

    return res.json({
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Could not delete project:", error);

    return res.status(500).json({
      message: "AgentForge could not delete the project.",
    });
  }
}
