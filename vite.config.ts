import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this repo under /llm_test/
  base: command === "build" ? "/llm_test/" : "/",
  plugins: [react()]
}));
