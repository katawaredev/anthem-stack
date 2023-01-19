// @ts-check
import fs from "fs";
import path from "path";

import lighthousHtmlReport from "lighthouse/report/generator/report-generator";
import htmlReport from "pa11y/lib/reporters/html";

/**
 * @param {any} lighthouseReport
 * @param {string} baseUrl
 */
export function saveLighthouseHtmlReport(lighthouseReport, baseUrl) {
  const url = lighthouseReport.artifacts.URL.requestedUrl;
  const content = lighthousHtmlReport.generateReport(
    lighthouseReport.lhr,
    "html"
  );
  if (typeof content === "string")
    writeReport(baseUrl, url, "lighthouse", content, "html");
  else
    for (let i = 0; i < content.length; i++)
      writeReport(baseUrl, url, "lighthouse", content[i], `${i}.html`);
}

/**
 * @param {any} pa11yReport
 * @param {string} baseUrl
 */
export function savePa11yHtmlReport(pa11yReport, baseUrl) {
  htmlReport.results(pa11yReport).then((content) => {
    writeReport(baseUrl, pa11yReport.pageUrl, "pa11y", content, "html");
  });
}

/**
 * @param {string} baseUrl
 * @param {string} url
 * @param {"lighthouse" | "pa11y"} type
 * @param {string} content
 * @param {string} ext
 */
function writeReport(baseUrl, url, type, content, ext) {
  // Save the Lighthouse report to cypress/reports/
  const outputPath = path.resolve(".", "cypress", "reports");
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }
  // the fileName should be the name of the page we're auditing
  const fileName = url
    .substring(baseUrl.length + 1)
    // @ts-expect-error
    .replaceAll("/", "_"); // Sub pages should not have path separator

  fs.writeFileSync(
    `${outputPath}/${fileName}-${type}-${
      new Date().toISOString().split("T")[0]
    }.${ext}`,
    content
  );
}
