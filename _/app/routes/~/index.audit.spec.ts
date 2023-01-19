import { test } from "~test/audit";

test.describe("public audits", () => {
  test("should audit home page", async ({ page, axe, lighthouse }) => {
    await page.goto("/~");

    // await axe();
    await lighthouse();
  });
});
