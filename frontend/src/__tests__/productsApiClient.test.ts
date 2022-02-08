import nock from 'nock';
import {addQuantity, createProduct, getProducts} from "../productsApiClient";

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
                    'Content-Type': 'text/plain'
                }
            }).post('/products', 'my-new-product')
                .reply(200, {name: "my-new-product", quantity: 0});

            const response = await createProduct("my-new-product");

            expect(scope.isDone()).toEqual(true);
            expect(response.name).toEqual("my-new-product");
            expect(response.quantity).toEqual(0);
        });
    });

    describe('addQuantity', () => {
        it('should make a post request to update the product quantity', async () => {
            const testProductId = 33;
            const testQuantityToAdd = 17;

            const scope = nock('http://localhost')
                .post(`/products/add/${testProductId}/${testQuantityToAdd}`)
                .reply(200, `${testQuantityToAdd}`);

            const response = await addQuantity(testProductId, testQuantityToAdd);

            expect(scope.isDone()).toEqual(true);
            expect(response).toEqual(testQuantityToAdd);
        });
    });
});