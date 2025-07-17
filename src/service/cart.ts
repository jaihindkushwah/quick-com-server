import { ICart } from "@/@types/schema";
import { CartModel } from "@/models/cart";
import { DeleteResult } from "mongoose";

export class CartService {
  constructor(private readonly cartModel = CartModel) {}
  async createNewCart(cart: Omit<ICart, "_id">): Promise<ICart> {
    return (await this.cartModel.create(cart)) as ICart;
  }
  async getCartById(cartId: ICart["_id"]): Promise<ICart> {
    return (await this.cartModel.findById(cartId)) as ICart;
  }
  async getCartByCustomerId(customerId: ICart["customerId"]): Promise<ICart[]> {
    return (await this.cartModel.find({ customerId })) as ICart[];
  }
  async deleteCartById(cartId: ICart["_id"]): Promise<ICart> {
    return (await this.cartModel.findByIdAndDelete(cartId)) as ICart;
  }
  async deleteCartByCustomerId(customerId: ICart["customerId"]): Promise<DeleteResult> {
    return await this.cartModel.deleteMany({ customerId });
  }
  async updateCartById(cartId: ICart["_id"], cart: Partial<ICart>): Promise<ICart> {
    const filteredCart = Object.fromEntries(
      Object.entries(cart).filter(([key, value]) => value !== undefined)
    );
    return (await this.cartModel.findByIdAndUpdate(cartId, filteredCart, {
      new: false,
    })) as ICart;
  }
}
