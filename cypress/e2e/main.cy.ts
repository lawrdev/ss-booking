import { slugify } from "./../../src/helpers/functions/index";
import { AddDeliveryModal } from "../interface/Modal";
import Navigate from "../interface/Navigate";

describe("E2E tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("fetches locations", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.env("NEXT_PUBLIC_BASE_URL")}/locations`,
      // failOnStatusCode: false,
      headers: {
        app_id: Cypress.env("NEXT_PUBLIC_SS_ID"),
        app_secret: Cypress.env("NEXT_PUBLIC_SS_SECRET"),
      },
    }).as("getLocations");

    cy.get("@getLocations").its("status").should("eq", 200);
  });

  it("populates locations", () => {
    cy.dataCy("pickup-select-state")
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .should("have.length.above", 0);

    cy.dataCy("pickup-select-area")
      .click()
      .get(".react-select__menu")
      .find(".react-select__option")
      .should("have.length.above", 0);
  });

  describe.only("Can complete booking", () => {
    it("can add a new delivery location", () => {
      const navigate = new Navigate();
      navigate.toDeliveryStage();

      cy.dataCy("delivery-btn-book-now").should("be.disabled");

      const modal = new AddDeliveryModal();
      modal.openModal().fillForm(slugify(`test name`)).savelocation();
      cy.dataCy("saved-location")
        .last()
        .dataCy("saved-location-name")
        .should("have.text", slugify(`test name`));

      cy.dataCy("saved-location")
        .first()
        .dataCy("saved-location-checkbox")
        .click();
      cy.dataCy("delivery-btn-book-now").should("not.be.disabled").click();
      cy.dataCy("btn-confirm-booking").click();
      cy.intercept(
        "POST",
        `${Cypress.env("NEXT_PUBLIC_BASE_URL")}/deliveries`
      ).as("booking");
      cy.wait("@booking").its("response.statusCode").should("eq", 200);
    });
  });
});
