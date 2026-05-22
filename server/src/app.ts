import cors from "cors";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import projectRoutes from "./routes/project.routes.js";

// creates the express application

const app = express();

app.use(cors()); // allows the react frontend to call the backend
app.use(express.json()); // allows Express to read JSON request bodies.

app.use("/api/health", healthRoutes); // connects health routes to the app
app.use("/api/projects", projectRoutes); // connects project routes to the app

export default app;
