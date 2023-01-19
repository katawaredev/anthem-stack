import { test } from "~test/e2e";
import { faker } from "@faker-js/faker";

test.describe("register tests", () => {
  // test.afterEach(() => {
  //   cy.cleanupUser();
  // });
  test("should allow you to register and login", async ({ page }) => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    await page.goto("/~");

    await page.locator("role=link", { hasText: /sign up/i }).click();

    await page.locator("input[name='email']").type(loginForm.email);

    await page.locator("input[name='password']").type(loginForm.password);

    await page.locator("role=button", { hasText: /create account/i }).click();

    await page.locator("role=link", { hasText: /notes/i }).click();

    await page.locator("role=button", { hasText: /logout/i }).click();

    await page.locator("role=link", { hasText: /log in/i }).click();
  });
});
