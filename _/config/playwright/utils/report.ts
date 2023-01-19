import type { TestInfo } from "@playwright/test";
import path from "path";

export function getReportTarget(testInfo: TestInfo, type: string) {
  return {
    name: `${testInfo.title}-${new Date().toISOString().split("T")[0]}`,
    directory: path.join.apply(null, [
      process.cwd(),
      "reports",
      type,
      ...testInfo.titlePath.slice(1), // Skip file name
    ]),
  };
}
