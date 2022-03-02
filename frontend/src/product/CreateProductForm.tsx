import {Box, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, {FormEvent, useState} from "react";
import {createProduct} from "./productsApiClient";

interface CreateProductFormProps {
    fetchInventory: () => void
}

export const CreateProductForm = (props: CreateProductFormProps) => {
    const {fetchInventory} = props
    const [modelNumber, setModelNumber] = useState(0);
    const [productName, setProductName] = useState("");

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();
        await createProduct(productName, modelNumber)
        fetchInventory()
    };

    return (
        <Box display='flex' flexDirection='row'>
            <h1>Add a new part:</h1>
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
    )
}