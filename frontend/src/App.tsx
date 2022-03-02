import React, {useEffect, useState} from "react";
import {getProducts} from "./product/productsApiClient";
import {Container} from "@mui/material";
import {Product} from "./product";
import {InventoryTable} from "./inventory/InventoryTable";
import {CreateProductForm} from "./product/CreateProductForm";

const App = () => {
    const [products, setProducts] = useState<Product[]>([]);

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
            <CreateProductForm fetchInventory={fetchInventory}/>
        </Container>
    );
}

export default App;
