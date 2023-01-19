/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.{test,spec}.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: ["@flowganizer/translation"],
};
