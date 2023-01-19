import { test, expect } from "~test/e2e";

test("homepage has Example Domain in title and more information link linking to the IANA", async ({
  page,
}) => {
  await page.goto("https://example.com/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Example Domain/);

  // create a locator
  const getStarted = page.locator("text=More information...");

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute(
    "href",
    "https://www.iana.org/domains/example"
  );

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*reserved/);
});
