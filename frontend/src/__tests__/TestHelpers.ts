import {Product} from "../product";

export const testProduct = {
    id: 33,
    name: "shiny new product",
    quantity: 3,
    modelNumber: 234
} as Product

export const createTestProduct = (product: Partial<Product>) : Product => {
    return {
        id: product.id ?? testProduct.id,
        name: product.name ?? testProduct.name,
        quantity: product.quantity ?? testProduct.quantity,
        modelNumber: product.modelNumber ?? testProduct.modelNumber
    }
}
