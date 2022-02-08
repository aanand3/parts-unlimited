import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, {useState} from "react";
import {Product} from "../product";
import {AddQuantityComponent} from "../product/AddQuantityComponent";

interface InventoryTableProps {
    products: Product[]
    fetchInventory: ()=>void
}

export const InventoryTable = (props: InventoryTableProps) => {
    const {products, fetchInventory} = props

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Part</TableCell>
                        <TableCell align="right">Current Quantity</TableCell>
                        <TableCell align="right">Adjustments</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow
                            key={product.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <strong>{product.name}</strong>
                            </TableCell>
                            <TableCell align="right">{product.quantity}</TableCell>
                            <TableCell align="right">
                                <AddQuantityComponent product={product} fetchInventory={fetchInventory}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}