describe("audit tests", { browser: "chrome" }, () => {
  it("should audit home page", () => {
    cy.visitAndCheck("/~");
    cy.lighthouse();
    cy.pa11y();
  });
});
