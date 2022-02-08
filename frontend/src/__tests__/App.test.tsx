import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import {addQuantity, createProduct, getProducts, placeOrder} from "../product/productsApiClient";

jest.mock("../product/productsApiClient");

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;
const mockCreateProduct = createProduct as jest.MockedFunction<typeof createProduct>;
const mockAddQuantity = addQuantity as jest.MockedFunction<typeof addQuantity>;
const mockPlaceOrder = placeOrder as jest.MockedFunction<typeof placeOrder>;

const addProduct = (product: string, modelNumber: number = 234) => {
    userEvent.type(screen.getByLabelText(/product name/), product);
    userEvent.type(screen.getByLabelText(/model number/), modelNumber.toString());
    userEvent.click(screen.getByLabelText(/add product/i));
}

const addQuantityToProduct = (quantityToAdd: number) => {
    userEvent.type(screen.getByLabelText("amount to add"), quantityToAdd.toString());
    userEvent.click(screen.getByLabelText("add quantity"));
}

const orderProduct = (quantityToRequest: number) => {
    userEvent.type(screen.getByLabelText(/amount to request/), quantityToRequest.toString());
    userEvent.click(screen.getByLabelText("request quantity"));
}

describe("inventory", () => {
    describe("when I view the inventory", () => {
        it("should display the products", async () => {
            mockGetProducts.mockResolvedValue([{id: 33, name: "a product", quantity: 0, modelNumber: 234}]);

            render(<App/>);

            expect(await screen.findByText("a product")).toBeInTheDocument();
        });

        it("should display the products' quantities", async () => {
            mockGetProducts.mockResolvedValue([{id: 33, name: "a product", quantity: 0, modelNumber: 234}]);

            render(<App/>);

            expect(screen.getByText(/Current Quantity/i)).toBeInTheDocument();
            expect(await screen.findByText("0")).toBeInTheDocument();
        });
    });

    describe("when I add a new product", () => {
        it("should display the new product", async () => {
            mockCreateProduct.mockResolvedValueOnce({id: 33, name: "shiny new product", quantity: 0, modelNumber: 234});
            mockGetProducts.mockResolvedValueOnce([]);
            mockGetProducts.mockResolvedValueOnce([{id: 33, name: "shiny new product", quantity: 0, modelNumber: 234}]);

            render(<App/>);
            addProduct("shiny new product", 333);

            expect(mockCreateProduct).toHaveBeenCalledWith("shiny new product", 333);
            expect(await screen.findByText("shiny new product")).toBeInTheDocument();
            expect(await screen.findByText("234")).toBeInTheDocument();
        });
    });

    describe('when I add quantity to a product', () => {
        it('should update the amount shown in the table', async () => {
            const productId = 33;
            const oldQuantity = 3;
            const quantityToAdd = 17;

            mockAddQuantity.mockResolvedValueOnce(quantityToAdd);
            mockGetProducts.mockResolvedValueOnce([{
                id: 33,
                name: "shiny new product",
                quantity: oldQuantity,
                modelNumber: 234
            }]);
            mockGetProducts.mockResolvedValueOnce([{
                id: productId,
                name: "shiny new product",
                quantity: oldQuantity + quantityToAdd
                , modelNumber: 234
            }]);

            render(<App/>);

            expect(await screen.findByText("shiny new product")).toBeVisible();
            addQuantityToProduct(quantityToAdd);

            expect(mockAddQuantity).toHaveBeenCalledWith(productId, quantityToAdd);
            expect(await screen.findByText(oldQuantity + quantityToAdd)).toBeVisible();
        });
    });

    describe('when I order a product', () => {
        it('should let me know that the order was successful', async () => {
            const productName = "shiny new product"
            const productId = 33;
            const oldQuantity = 10;
            const quantityToRequest = 7;
            const itemsRemaining = oldQuantity - quantityToRequest;

            mockPlaceOrder.mockResolvedValueOnce(itemsRemaining);
            mockGetProducts.mockResolvedValueOnce([{
                id: 33,
                name: productName,
                quantity: oldQuantity,
                modelNumber: 234
            }]);
            mockGetProducts.mockResolvedValue([{
                id: productId,
                name: productName,
                quantity: itemsRemaining
                , modelNumber: 234
            }]);

            render(<App/>);

            expect(await screen.findByText(productName)).toBeVisible();

            orderProduct(quantityToRequest)

            expect(mockPlaceOrder).toHaveBeenCalledWith(productId, quantityToRequest);
            expect(await screen.findByText(itemsRemaining)).toBeVisible();
            expect(await screen.findByText(`Success! You will receive ${productName} x ${quantityToRequest}`)).toBeVisible();
        });

        it('should let me know that the order was partially successful', async () => {
            const productName = "shiny new product"
            const productId = 33;
            const oldQuantity = 10;
            const quantityToRequest = 20;
            const itemsRemaining = oldQuantity - quantityToRequest;

            mockPlaceOrder.mockResolvedValueOnce(itemsRemaining);
            mockGetProducts.mockResolvedValueOnce([{
                id: 33,
                name: productName,
                quantity: oldQuantity,
                modelNumber: 234
            }]);
            mockGetProducts.mockResolvedValue([{
                id: productId,
                name: productName,
                quantity: 0
                , modelNumber: 234
            }]);

            render(<App/>);

            expect(await screen.findByText(productName)).toBeVisible();

            orderProduct(quantityToRequest)

            expect(mockPlaceOrder).toHaveBeenCalledWith(productId, quantityToRequest);
            expect(await screen.findByText("0")).toBeVisible();
            expect(await screen.findByText("You will receive shiny new product x 10." +
                " Note that your order was NOT completely fulfilled." +
                " Your delivery will be short 10 items.")).toBeVisible();
        });
    });
});
