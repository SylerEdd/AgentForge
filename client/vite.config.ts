import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // react() allows vite to run react code and tailwindcss() allows vite to run tailwind css
  server: {
    port: 5173, // run the development server on port 5173
  },
});
