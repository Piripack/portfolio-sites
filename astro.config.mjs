import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://example.github.io/portfolio-sites/",
  base: "/portfolio-sites/",
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: "static",
  trailingSlash: "always",
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
          },
        },
      },
    },
  },
});
