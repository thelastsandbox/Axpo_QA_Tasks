/// <reference types="Cypress" />

const baseUrl = Cypress.env("baseUrl");

describe("Conduit Login", () => {
  before(() => cy.registerUserIfNeeded());
  beforeEach(() => {
    cy.visit(baseUrl);
    cy.wait(5000);
    // we are not logged in
  });

  it("does not work with wrong credentials", () => {
    cy.contains("a.nav-link", "Sign in").click();
    cy.wait(5000);
    cy.get('input[formcontrolname="email"]').type("wrong@email.com");
    cy.wait(5000);
    cy.get('input[formcontrolname="password"]').type("no-such-user");
    cy.wait(5000);
    cy.get('button[type="submit"]').click();
    cy.wait(5000);
    // error message is shown and we remain on the login page
    cy.contains("email or password is invalid");
    cy.wait(5000);
    cy.url().should("contain", "/login");
  });

  it("logs in", () => {
    cy.wait(5000);
    cy.contains("a.nav-link", "Sign in").click();
    cy.wait(5000);
    cy.get('input[formcontrolname="email"]').type("pepe.jobs@gmail.com");
    cy.wait(5000);
    cy.get('input[formcontrolname="password"]').type("pepe");
    cy.wait(5000);
    cy.get('button[type="submit"]').click();
    cy.wait(5000);

    // when we are logged in, there should be two feeds
    //cy.contains("a.nav-link", "Your Feed").should("have.class", "active");
    //cy.wait(5000)
    //cy.contains("a.nav-link", "Global Feed").should("not.have.class", "active");
    //cy.wait(5000)
    // url is /
    cy.url().should("not.contain", "/login");
    cy.wait(5000);
  });
});
