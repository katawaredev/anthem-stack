import { test } from "~test/audit";

test.describe("Example", () => {
  test.use({ thresholds: { pwa: 0 }, disableAxeRules: "html-has-lang" });
  test("should pass audit tests", async ({ page, axe, lighthouse }) => {
    await page.goto("https://example.com/");
    await axe();
    await lighthouse();
  });
});
