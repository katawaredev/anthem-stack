import type { PlaywrightTestConfig } from "@playwright/experimental-ct-react";
import type { PlaywrightTestConfig as PlaywrightComponentsTestConfig } from "@playwright/experimental-ct-react";

import {
  createProject,
  createE2EProject,
  createAuditProject,
} from "./utils/project";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig & PlaywrightComponentsTestConfig = {
  testDir: "./smoke/",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "dot",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",

    ctTemplateDir: "template",

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
  ],
};

export default config;
