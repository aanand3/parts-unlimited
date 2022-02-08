import React, {FormEvent, useEffect, useState} from "react";
import {createProduct, getProducts} from "./product/productsApiClient";
import {Box, Container, TextField} from "@mui/material";
import {Product} from "./product";
import {InventoryTable} from "./inventory/InventoryTable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";

const App = () => {
    const [productName, setProductName] = useState<string>("");
    const [modelNumber, setModelNumber] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);

    const setProductNameFromInput = (event: FormEvent<HTMLInputElement>) => {
        setProductName(event.currentTarget.value);
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault();
        createProduct(productName, modelNumber).then(() => {
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
                    <TextField
                        value={modelNumber}
                        onChange={(event) => setModelNumber(+event.target.value)}
                        id="outlined-number"
                        label="model number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <TextField
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        id="outlined-text"
                        label="product name"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />

                    <IconButton
                        color="success"
                        size="large"
                        aria-label="add product"
                        type="submit"
                    >
                        <AddCircleOutlineIcon/>
                    </IconButton>

                </form>
            </Box>
        </Container>
    );
}

export default App;
