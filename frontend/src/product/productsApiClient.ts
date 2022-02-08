import axios from "axios";
import {Product} from "../product";

export async function createProduct(product: string): Promise<Product> {
  return (await axios.post<Product>("/products", product, {headers: {'Content-Type': 'text/plain'}})).data
}

export async function getProducts(): Promise<Product[]> {
  return (await axios.get<Product[]>("/products")).data
}

export async function addQuantity(productId: number, quantityToAdd: number): Promise<number> {
  return (await axios.post<number>(`/products/add/${productId}/${quantityToAdd}`)).data
}

export async function placeOrder(productId: number, requestedQuantity: number): Promise<number> {
  return (await axios.post<number>(`/products/order/${productId}/${requestedQuantity}`)).data
}
