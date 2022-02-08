import {Product} from "../product";
import {Snackbar, TextField} from "@mui/material";
import React, {useState} from "react";
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import {placeOrder} from "./productsApiClient";

interface OrderProductComponentProps {
    product: Product
    fetchInventory: () => void
}

export const OrderProductComponent = (props: OrderProductComponentProps) => {
    const {product, fetchInventory} = props

    const [quantityToOrder, setQuantityToOrder] = useState<number>(0);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showFailureMessage, setShowFailureMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [failureMessage, setFailureMessage] = useState("");

    const handleSubmit = async () => {
        const itemsRemaining = await placeOrder(product.id, quantityToOrder)
        if (itemsRemaining >= 0) {
            setSuccessMessage(`Success! You will receive ${product.name} x ${quantityToOrder}`)
            setShowSuccessMessage(true)
        }
        if (itemsRemaining < 0) {
            const itemsSuccessfullyOrdered = product.quantity
            const itemsNotOrdered = -itemsRemaining

            setSuccessMessage(`You will receive ${product.name} x ${itemsSuccessfullyOrdered}.
            Note that your order was NOT completely fulfilled. 
            Your delivery will be short ${itemsNotOrdered} items.`
            )
            setShowSuccessMessage(true)
        }
        fetchInventory();
        setQuantityToOrder(0)
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowFailureMessage(false)
        setShowSuccessMessage(false);
    };

    return (
        <>
            <TextField
                value={quantityToOrder}
                onChange={(event) => setQuantityToOrder(+event.target.value)}
                label="amount to request"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <IconButton
                color="success"
                size="large"
                aria-label="request quantity"
                onClick={() => handleSubmit()}
            >
                <SendIcon/>
            </IconButton>
            <Snackbar
                open={showSuccessMessage}
                autoHideDuration={6000}
                onClose={handleClose}
                message={successMessage}
            />
        </>

    )
}