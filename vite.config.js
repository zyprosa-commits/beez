import { defineConfig } from "vite";
export default defineConfig({
  build: {
    rollupOptions: { output: { manualChunks: { "pip-engine": ["three"] } } },
  },
});
