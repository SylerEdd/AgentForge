import Router from "express";
import {
  generateProject,
  getProject,
  getProjects,
  runProjectTests,
} from "../controller/projectController.js";

// creates the router for project-related endpoints

const router = Router();

router.get("/", getProjects); // GET /api/projects - gets all projects
router.get("/:id", getProject); // GET /api/projects/:id - gets a single project by id
router.post("/generate", generateProject); // POST /api/projects/generate - generates a project based on the provided idea
router.post("/:id/run-tests", runProjectTests);
export default router;
