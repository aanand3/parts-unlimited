import nock from 'nock';
import {addQuantity, createProduct, getProducts, placeOrder} from "../product/productsApiClient";

describe('productsApiClient', () => {
    describe('getProducts', () => {
        it('should make a GET request to retrieve all products', async () => {
            const expectedProducts = [{name: 'first-product', quantity: 0}, {name: 'second-product', quantity: 2}];
            nock('http://localhost').get('/products').reply(200, expectedProducts);

            const actualProducts = await getProducts();

            expect(actualProducts).toEqual(expectedProducts);
        });
    });

    describe('createProduct', () => {
        it('should make a POST request to create a product', async () => {
            const scope = nock('http://localhost', {
                reqheaders: {
                    'Content-Type': 'application/json'
                }
            }).post('/products', "{\"productName\":\"my-new-product\",\"modelNumber\":234}")
                .reply(200, {name: "my-new-product", quantity: 0, modelNumber: 234});

            const response = await createProduct("my-new-product", 234);

            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual("my-new-product");
            expect(response.quantity).toEqual(0);
            expect(response.modelNumber).toEqual(234);
        });
    });

    describe('addQuantity', () => {
        it('should make a post request to update the product quantity', async () => {
            const productId = 33;
            const quantityToAdd = 17;

            const scope = nock('http://localhost')
                .post(`/products/add/${productId}/${quantityToAdd}`)
                .reply(200, `${quantityToAdd}`);

            const response = await addQuantity(productId, quantityToAdd);

            expect(scope.isDone()).toEqual(true);
            expect(response).toEqual(quantityToAdd);
        });
    });

    describe('placeOrder', () => {
        it('should make a post request and return the number of items remaining', async () => {
            const productId = 33;
            const requestedQuantity = 17;
            const itemsRemaining = 14;

            const scope = nock('http://localhost')
                .post(`/products/order/${productId}/${requestedQuantity}`)
                .reply(200, `${itemsRemaining}`);

            const response = await placeOrder(productId, requestedQuantity);

            expect(scope.isDone()).toEqual(true);
            expect(response).toEqual(itemsRemaining);
        });
    })
});