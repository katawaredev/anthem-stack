describe("authenticated tests", { browser: "chrome" }, () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should audit user home page", () => {
    cy.login();

    cy.visitAndCheck("/~");

    cy.findByRole("link", { name: /notes/i }).click();

    cy.lighthouse();
    cy.pa11y();
  });
});
