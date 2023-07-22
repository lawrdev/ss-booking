import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(value: string): Chainable<Element>;
      selectInputandType(name: string, value: string): Chainable<Element>;
      selectReactSelect(name: string, value: number): Chainable<Element>;
    }
  }
}
