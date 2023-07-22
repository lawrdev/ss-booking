import { DeliveryLocationFormData } from "./../../src/helpers/types/index";

export class AddDeliveryModal {
  openModal() {
    cy.dataCy("modal-btn-add-delivery").click();
    return this;
  }
  fillForm(slug: string) {
    cy.selectInputandType("delivery-input-name", slug);
    cy.selectInputandType("delivery-input-phone", "09051995887");
    cy.selectReactSelect("delivery-input-state", 0);
    cy.selectReactSelect("delivery-input-area", 1);
    cy.selectInputandType(
      "delivery-input-address",
      "no 90 wolvesbane ave, ikeja"
    );
    return this;
  }
  savelocation() {
    cy.dataCy("delivery-btn-save").click();
    return this;
  }
}
