import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {addQuantity, createProduct, getProducts} from "../product/productsApiClient";

jest.mock("../productsApiClient");

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;
const mockAddQuantity = addQuantity as jest.MockedFunction<typeof addQuantity>;

const addProduct = (product: string) => {
  userEvent.type(screen.getByLabelText("Product to add"), product);
  userEvent.click(screen.getByLabelText(/add product/i));
}

const addQuantityToProduct = (quantityToAdd: number) => {
  userEvent.type(screen.getByLabelText("amount to add"), quantityToAdd.toString());
  userEvent.click(screen.getByLabelText("add quantity"));
}

describe("inventory", () => {
  describe("when I view the inventory", () => {
    it("should display the products", async () => {
      mockGetProducts.mockResolvedValue([{id: 33, name: "a product", quantity: 0}]);

      render(<App/>);

      expect(await screen.findByText("a product")).toBeInTheDocument();
    });

    it("should display the products' quantities", async () => {
      mockGetProducts.mockResolvedValue([{id: 33, name: "a product", quantity: 0}]);

      render(<App/>);

      expect(screen.getByText(/Current Quantity/i)).toBeInTheDocument();
      expect(await screen.findByText("0")).toBeInTheDocument();
    });
  });

  describe("when I add a new product", () => {
    it("should display the new product", async () => {
      mockCreateProduct.mockResolvedValueOnce({id: 33, name: "shiny new product", quantity: 0});
      mockGetProducts.mockResolvedValueOnce([]);
      mockGetProducts.mockResolvedValueOnce([{id: 33, name: "shiny new product", quantity: 0}]);

      render(<App/>);
      addProduct("shiny new product");

      expect(mockCreateProduct).toHaveBeenCalledWith("shiny new product");
      expect(await screen.findByText("shiny new product")).toBeInTheDocument();
    });
  });

  describe('when I add quantity to a product', () => {
    it('should update the amount shown in the table', async () => {
      const productId = 33;
      const oldQuantity = 3;
      const quantityToAdd = 17;

      mockAddQuantity.mockResolvedValueOnce(quantityToAdd);
      mockGetProducts.mockResolvedValue([{id: 33, name: "shiny new product", quantity: oldQuantity}]);
      mockGetProducts.mockResolvedValueOnce([{id: productId, name: "shiny new product", quantity: oldQuantity + quantityToAdd}]);

      render(<App/>);

      expect(await screen.findByText("shiny new product")).toBeInTheDocument();
      addQuantityToProduct(quantityToAdd);

      expect(mockAddQuantity).toHaveBeenCalledWith(productId, quantityToAdd);
      expect(await screen.findByText(oldQuantity+quantityToAdd)).toBeInTheDocument();
    });
  });
});
