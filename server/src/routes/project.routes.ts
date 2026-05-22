import Router from "express";
import { generateProject } from "../controller/projectController.js";

// creates the router for project-related endpoints

const router = Router();

router.post("/generate", generateProject); // POST /api/projects/generate - generates a project based on the provided idea

export default router;
