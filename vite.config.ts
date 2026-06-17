import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// The client dev server (5173) proxies API + tRPC calls to the Express
// server (3001) so cookies stay same-origin and everything "just works".
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/trpc": "http://localhost:3001",
      "/api": "http://localhost:3001",
    },
  },
  build: {
    outDir: "dist",
  },
});
