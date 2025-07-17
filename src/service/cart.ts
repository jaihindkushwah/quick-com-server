import { CartModel } from "@/models/cart";

export class CartService {
    constructor(private readonly cartModel=CartModel) {}
}