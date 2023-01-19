/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:playwright/playwright-test",
    "prettier",
  ],
  ignorePatterns: [
    ".cache",
    "/node_modules",
    "/build",
    "/public/build",
    "/cypress/reports",
    "/reports",
  ],
};
