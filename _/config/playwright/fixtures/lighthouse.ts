import { playAudit } from "playwright-lighthouse";
import { chromiumContext } from "./chromiumPersistentContext";
import { getReportTarget } from "~test/utils/report";

import defaultConfig from "lighthouse/lighthouse-core/config/default-config";
import desktopConfig from "lighthouse/lighthouse-core/config/desktop-config";
import lrDesktopConfig from "lighthouse/lighthouse-core/config/lr-desktop-config";
import lrMobileConfig from "lighthouse/lighthouse-core/config/lr-mobile-config";
import performanceConfig from "lighthouse/lighthouse-core/config/perf-config";
import fullConfig from "lighthouse/lighthouse-core/config/full-config";
import experimentalConfig from "lighthouse/lighthouse-core/config/experimental-config";

import type {
  ChromiumFixturesT,
  ChromiumFixturesW,
} from "./chromiumPersistentContext";
import type { TestFixturesType } from "../types";

const lighthouseConfig = {
  default: defaultConfig,
  desktop: desktopConfig,
  "lr-desktop": lrDesktopConfig,
  "lr-mobile": lrMobileConfig,
  performance: performanceConfig,
  full: fullConfig,
  experimental: experimentalConfig,
};

export type LighthouseFixturesT = ChromiumFixturesT & {
  lighthouse: () => Promise<any>;
  thresholds: {
    performance?: number;
    accessibility?: number;
    "best-practices"?: number;
    seo?: number;
    pwa?: number;
  };
  deviceConfig: keyof typeof lighthouseConfig;
};

const defaultThresholds = {
  performance: 85,
  accessibility: 50,
  "best-practices": 85,
  seo: 85,
  pwa: 50,
};

export type LighthouseFixturesW = ChromiumFixturesW;

export const lighthouse: TestFixturesType<
  LighthouseFixturesT,
  LighthouseFixturesW
> = {
  ...chromiumContext,

  thresholds: [defaultThresholds, { option: true }],

  deviceConfig: ["desktop", { option: true }],

  lighthouse: [
    async (
      { page, port, context, thresholds, deviceConfig },
      use,
      testInfo
    ) => {
      await use(async () => {
        // Lighthouse checks should be performed only on production build
        if (process.env.PLAYWRIGHT_ENV !== "production") return;

        const reports = !process.env.CI
          ? {
              formats: {
                json: false,
                html: true,
                csv: false,
              },
              ...getReportTarget(testInfo, "lighthouse"),
            }
          : undefined;

        const url = page.url();
        for (const p of await context.pages()) p.close();

        await playAudit({
          url,
          thresholds: { ...defaultThresholds, ...thresholds },
          config: lighthouseConfig[deviceConfig],
          reports,
          port,
          disableLogs: !!process.env.CI,
        });
      });
    },
    { scope: "test" },
  ],
};
