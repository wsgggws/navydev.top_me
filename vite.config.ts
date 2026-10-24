import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // 这个站点现在挂在 https://navydev.top/me/，不能让产物继续引用根路径 /assets。
  base: "/me/",
  plugins: [react()],
  resolve: {
    alias: {
      "@movie": path.resolve(__dirname, "movie"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        onlyExplicitManualChunks: true,
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("/react/") || id.includes("/react-dom/")) return "vendor-react";
          if (id.includes("/gsap/")) return "vendor-motion";
          return undefined;
        },
      },
    },
  },
});
