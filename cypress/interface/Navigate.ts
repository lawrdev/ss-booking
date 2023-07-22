export default class Navigate {
  toDeliveryStage() {
    cy.visit("/");
    cy.selectInputandType("pickup-input-name", "Lawrence");
    cy.selectInputandType("pickup-input-phone", "09051995887");
    cy.selectReactSelect("pickup-select-state", 0);
    cy.selectReactSelect("pickup-select-area", 0);
    cy.selectInputandType(
      "pickup-input-address",
      "no 90 wolvesbane ave, ikeja"
    );
    cy.selectInputandType("pickup-input-date", "2024-12-31");

    cy.dataCy("pickup-btn-continue").click();

    cy.dataCy("delivery-list").should("be.visible");

    return this;
  }
}
