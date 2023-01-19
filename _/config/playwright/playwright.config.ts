import type { PlaywrightTestConfig } from "@playwright/test";
import type { PlaywrightTestConfig as PlaywrightComponentsTestConfig } from "@playwright/experimental-ct-react";
import type { Project } from "./utils/project";
import {
  createProject,
  createE2EProject,
  createAuditProject,
} from "./utils/project";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

const PORT = 8811;
const CWD = "./config/playwright";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig & PlaywrightComponentsTestConfig = {
  globalSetup: `${CWD}/global-setup.ts`,
  testDir: "./app",

  /* Maximum time one test can run for. */
  timeout: 10 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? "dot"
    : [
        [
          "html",
          {
            outputFolder: `reports/playwright`,
            open: process.env.CI ? "never" : "on-failure",
          },
        ],
      ],

  /* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
  snapshotDir: "./__snapshots__",

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `http://localhost:${PORT}`,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    ctTemplateDir: "config/playwright/template",

    /* Port to use for Playwright component endpoint. */
    ctPort: 3100,
  },

  /* Configure projects for major browsers */
  projects: [
    createAuditProject(),

    createProject("chromium", "Desktop Chrome"),
    createProject("firefox", "Desktop Firefox"),
    createE2EProject("chromium-e2e", "Desktop Chrome"),
    createE2EProject("firefox-e2e", "Desktop Firefox"),
    //createE2EProject("webkit-e2e", "Desktop Safari"),

    /* Test against mobile viewports. */
    // createE2EProject("mobile-chrome-e2e", "Pixel 5"),
    // createE2EProject("mobile-safari-e2e", "iPhone 12"),

    /* Test against branded browsers. */
    // createE2EProject("edge-e2e", "Microsoft Edge"),
    // createE2EProject("chrome-e2e", "Google Chrome"),
  ].filter(Boolean) as Project[],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: `results/`,

  /* Run your local dev server before starting the tests */
  webServer: {
    command:
      process.env.NODE_ENV === "production"
        ? `cross-env PORT=${PORT} RUNNING_E2E=true npm run start:mocks`
        : `cross-env PORT=${PORT} RUNNING_E2E=true npm run dev`,
    port: PORT,
  },
};

export default config;
