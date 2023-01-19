// https://playwright.dev/docs/accessibility-testing
import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";
import { getReportTarget } from "~test/utils/report";

import type { TestFixturesType } from "../types";

export type AxeFixtureT = {
  withAxeTags?: string[];
  disableAxeRules?: string;
  axe: () => void;
};

export const axe: TestFixturesType<AxeFixtureT, {}> = {
  withAxeTags: [["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"], { option: true }],
  disableAxeRules: [undefined, { option: true }],

  axe: [
    async ({ page, withAxeTags, disableAxeRules }, use, testInfo) => {
      const axe = async () => {
        const builder = new AxeBuilder({ page });
        if (withAxeTags) builder.withTags(withAxeTags);
        if (disableAxeRules) builder.disableRules(disableAxeRules);

        const results = await builder.analyze();

        if (!process.env.CI) {
          const { name, directory } = await getReportTarget(testInfo, "axe");
          await fs.promises.mkdir(directory, { recursive: true });
          const reportHtml = await createHtmlReport({
            results,
            options: {
              customSummary: `Path: ${testInfo.titlePath.join(" > ")}`,
            },
          });
          fs.promises.writeFile(
            path.join(directory, `${name}.html`),
            reportHtml
          );
        }

        expect(
          [results.violations.map((rule) => rule.helpUrl)],
          "Should not have accessibility violations"
        ).toEqual([]);
      };
      use(axe);
    },
    { scope: "test" },
  ],
};
