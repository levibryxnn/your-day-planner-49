import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base:
    process.env.GITHUB_CDN_PREVIEW === "true"
      ? "./"
      : process.env.GITHUB_PAGES === "true"
        ? "/your-day-planner-49/"
        : "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rollupOptions: {
      input: "preview/index.html",
    },
  },
});
