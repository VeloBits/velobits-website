import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html"],
      include: [
        "components/**/*.tsx",
        "app/page.tsx",
        "app/api/**/*.ts",
        "lib/updates.ts",
        "lib/blog.ts",
        "lib/reading-time.ts",
      ],
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
      exclude: [
        "node_modules/**",
        ".next/**",
        "e2e/**",
        "**/*.config.*",
        "vitest.setup.ts",
        "app/layout.tsx",
        // Browser-interaction-only components (RAF loops, mousemove, matchMedia)
        // cannot be meaningfully branch-tested in jsdom.
        "components/ui/BackgroundSpark.tsx",
        "components/ui/CursorGlow.tsx",
        "components/ui/glowing-effect.tsx",
        // Async Server Component: does server-side fetch; has no RSC runtime in
        // jsdom. Its presentational seam (UpdatesList.tsx) is unit-tested instead.
        "components/sections/LatestUpdates.tsx",
        // Async RSC blog pages / route handler: server-side data fetch, no RSC
        // runtime in jsdom. Their presentational seams (components/blog/*) and
        // the data layer (lib/blog.ts) + RSS handler are unit-tested instead.
        "app/blog/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
