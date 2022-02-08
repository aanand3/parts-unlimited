const addProduct = (product: string, modelNumber: number = 234) => {
    cy.findByLabelText("product name").type(product);
    cy.findByLabelText("model number").type(modelNumber.toString());
    cy.findByLabelText(/add product/i).click();
}

describe("inventory", () => {
    describe("when adding a product offering", () => {
        it("should display the new product with a default quantity of 0", () => {
            cy.visit("http://localhost:8080");
            addProduct("shiny-new-product", 456);
            cy.findByText("shiny-new-product").should("exist");
            cy.findByText("0").should("exist");
            cy.findByText("456").should("exist");
        });
    });
    describe('changing quantity', () => {
        it('should allow user to add quantity', () => {
            cy.findByLabelText(/amount to add/).type("3")
            cy.findByLabelText(/add quantity/).click()
            cy.findByText("0").should("not.exist");
            cy.findByText("3").should("exist");
        });
    });
    describe('Placing an order that can be completely fulfilled', () => {
        it('should allow user to order and display new quantity and success msg', () => {
            cy.findByLabelText(/amount to request/).type("2")
            cy.findByLabelText(/request quantity/).click()
            cy.findByText("3").should("not.exist");
            cy.findByText("1").should("exist");
            cy.findByText(/Success! You will receive shiny-new-product x 2/).should("exist");
        });
    });
    describe('Placing an order that cannot only be partially fulfilled', () => {
        it('should allow user to order and display new quantity and success msg', () => {
            cy.findByLabelText(/amount to request/).type("3")
            cy.findByLabelText(/request quantity/).click()
            cy.findByText("1").should("not.exist");
            cy.findByText("0").should("exist");
            cy.findByText("You will receive shiny-new-product x 1. Note that your order was NOT completely fulfilled. Your delivery will be short 2 items.").should("exist");
        });
    });
});