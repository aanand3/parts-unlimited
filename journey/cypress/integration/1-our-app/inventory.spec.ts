const addProduct = (product: string) => {
    cy.findByLabelText("Product to add").type(product);
    cy.findByRole("button").click();
}
describe("inventory", () => {
    describe("when adding a product offering", () => {
        it("should display the new product with a default quantity of 0", () => {
            cy.visit("http://localhost:8080");
            addProduct("shiny-new-product");
            cy.findByText("shiny-new-product").should("exist");
            cy.findByText("0").should("exist");
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
});