import os from "os";
import path from "path";
import getPort from "get-port";
import { rm } from "fs/promises";

import { chromium } from "playwright";

import type { BrowserContext } from "@playwright/test";
import type { TestFixturesType } from "../types";

export type ChromiumFixturesT = {
  context: BrowserContext;
};

export type ChromiumFixturesW = {
  port: number;
};

export const chromiumContext: TestFixturesType<
  ChromiumFixturesT,
  ChromiumFixturesW
> = {
  // Assign a unique port for each test to allow them to run in parallel
  port: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const port = await getPort();
      await use(port);
    },
    { scope: "worker" },
  ],

  // Playwright does not by default allow shared contexts, we need to explicitly
  // create a persistent context to allow running behind authenticated routes.
  context: [
    async ({ port, launchOptions }, use) => {
      const userDataDir = path.join(
        os.tmpdir(),
        `chromium-${new Date().getTime()}-${String(Math.random())}`
      );
      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [
          ...(launchOptions.args || []),
          `--remote-debugging-port=${port}`,
        ],
      });

      // apply state previously saved in the the `globalSetup`
      // await context.addCookies(require("../../state-chrome.json").cookies);

      await use(context);
      await context.close();
      await rm(userDataDir, { recursive: true });
    },
    { scope: "test" },
  ],
};
