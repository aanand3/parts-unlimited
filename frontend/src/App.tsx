import React, {FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts} from "./product/productsApiClient";
import {Box, Container} from "@mui/material";
import {Product} from "./product";
import {InventoryTable} from "./inventory/InventoryTable";

const App = () => {
    const [productName, setProductName] = useState<string>("");
    const [products, setProducts] = useState<Product[]>([]);

    const setProductNameFromInput = (event: FormEvent<HTMLInputElement>) => {
        setProductName(event.currentTarget.value);
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault();
        createProduct(productName).then(() => {
            getProducts().then(setProducts);
        });
    };

    function fetchInventory() {
        getProducts().then(setProducts);
    }

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <Container sx={{mx: 1, my: 1}}>
            <h1>Parts Unlimited Inventory</h1>
            <InventoryTable products={products} fetchInventory={fetchInventory}/>
            <Box display='flex' flexDirection='row'>
                <form onSubmit={submitForm}>
                    <br/>
                    <label>
                        Product to add
                        <input name="product" type="text" onChange={setProductNameFromInput}/>
                    </label>
                    <button type="submit" aria-label="add product">Submit</button>
                </form>
            </Box>
        </Container>
    );
}

export default App;
