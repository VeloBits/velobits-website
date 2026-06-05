import { defineConfig, devices } from "@playwright/test";

// Port is overridable so the suite can target a dev server on a non-default
// port (e.g. when 3000 is already in use). Defaults to 3000 for CI/local.
const PORT = process.env.PORT || "3000";
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // Real mobile emulation (touch + mobile UA) for the responsive suite.
      // Scoped to responsive.spec.ts so the desktop-oriented specs keep running
      // only under the chromium project.
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
      testMatch: /responsive\.spec\.ts/,
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
