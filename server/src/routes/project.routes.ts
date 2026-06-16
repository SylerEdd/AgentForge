import Router from "express";
import {
  generateProject,
  getProject,
  getProjects,
  getProjectTestRuns,
  runProjectTests,
  deleteProject,
} from "../controller/projectController.js";

// creates the router for project-related endpoints

const router = Router();

router.get("/", getProjects); // GET /api/projects - gets all projects
router.get("/:id", getProject); // GET /api/projects/:id - gets a single project by id
router.get("/:id/test-runs", getProjectTestRuns); // GET /api/projects/:id/test-runs - gets all test runs for a project
router.post("/generate", generateProject); // POST /api/projects/generate - generates a project based on the provided idea
router.post("/:id/run-tests", runProjectTests); // POST /api/projects/:id/run-tests - runs all tests for a project
router.delete("/:id", deleteProject); // DELETE /api/projects/:id - deletes a project by id

export default router;
