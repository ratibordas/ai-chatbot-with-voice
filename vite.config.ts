import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as talwindVitePlugin from '@tailwindcss/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), talwindVitePlugin.default()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
