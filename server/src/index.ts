import app from "./app.js";
import { env } from "./config/env.js";

// starts the server

app.listen(env.port, () => {
  console.log(`AgentForge server running on port ${env.port}`);
});
