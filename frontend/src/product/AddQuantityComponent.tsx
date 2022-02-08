import {Product} from "../product";
import {TextField} from "@mui/material";
import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {addQuantity} from "../productsApiClient";

interface AddQuantityComponentProps {
    product: Product
    fetchInventory: () => void
}

export const AddQuantityComponent = (props: AddQuantityComponentProps) => {
    const {product, fetchInventory} = props
    const [quantityToAdd, setQuantityToAdd] = useState<number>(0);

    const handleSubmit = async () => {
        await addQuantity(product.id, quantityToAdd)
        fetchInventory();
        setQuantityToAdd(0)
    }

    return (
        <>
            <TextField
                value={quantityToAdd}
                onChange={(event) => setQuantityToAdd(+event.target.value)}
                id="outlined-number"
                label="amount to add"
                color="success"
                InputLabelProps={{
                    shrink: true,
                }}
                focused
            />
            <IconButton
                color="success"
                size="large"
                aria-label="add quantity"
                onClick={handleSubmit}
            >
                <AddCircleOutlineIcon/>
            </IconButton>
        </>

    )
}