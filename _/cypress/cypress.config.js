// @ts-check
import { defineConfig } from "cypress";
// @ts-ignore
import { lighthouse, prepareAudit } from "@cypress-audit/lighthouse";
// @ts-ignore
import { pa11y } from "@cypress-audit/pa11y";
import {
  saveLighthouseHtmlReport,
  savePa11yHtmlReport,
} from "./support/report";

export default defineConfig({
  e2e: {
    setupNodeEvents: (on, config) => {
      const isDev = config.watchForFileChanges;
      const port = process.env.PORT ?? (isDev ? "3000" : "8811");
      const baseUrl = `http://localhost:${port}`;

      /**
       * @type {Partial<Cypress.PluginConfigOptions>}
       */
      const configOverrides = {
        baseUrl,
        video: !process.env.CI,
        screenshotOnRunFailure: !process.env.CI,
      };

      on("before:browser:launch", (_browser, launchOptions) => {
        prepareAudit(launchOptions);
      });

      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          if (process.env.CI) return;

          saveLighthouseHtmlReport(lighthouseReport, baseUrl);
        }),

        pa11y: pa11y((pa11yReport) => {
          if (process.env.CI) return;

          savePa11yHtmlReport(pa11yReport, baseUrl);
        }),

        // To use this:
        // cy.task('log', whateverYouWantInTheTerminal)
        log: (message) => {
          console.log(message);

          return null;
        },
      });

      return { ...config, ...configOverrides };
    },
  },

  // @ts-expect-error Unable to extend lighthouse config
  lighthouse: {
    thresholds: {
      performance: 85,
      accessibility: 50,
      "best-practices": 85,
      seo: 85,
      pwa: 50,
    },
    options: {
      /* put your options here, like formFactor by default */
    },
    config: {
      extends: "lighthouse:default",
    },
  },
});
