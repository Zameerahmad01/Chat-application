import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      //eslint-disable-next-line
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  proxy: {
    "/cdn": {
      target: "https://unpkg.com",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/cdn/, ""),
    },
  },
});
