import { ICart, IProduct } from "@/@types/schema";
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
  async getCartByCustomerId(
    customerId: ICart["customerId"],
    populate: boolean = false
  ): Promise<ICart<IProduct> | ICart | null> {
    const query = this.cartModel.findOne({ customerId });
    if (populate) {
      query.populate("items.productId");
    }
    const cart = (await query.lean().exec()) as any;
    if (cart && populate) {
      cart.items = cart.items.map((item) => {
        return {
          productId: item.productId._id,
          ...item.productId,
          quantity: item.quantity,
          _id: item._id,
        };
      });
    }
    return cart as ICart<IProduct> | ICart | null;
  }
  async deleteCartById(cartId: ICart["_id"]): Promise<ICart> {
    return (await this.cartModel.findByIdAndDelete(cartId)) as ICart;
  }
  async deleteCartByCustomerId(
    customerId: ICart["customerId"]
  ): Promise<DeleteResult> {
    return await this.cartModel.deleteMany({ customerId });
  }
  async updateCartById(
    cartId: ICart["_id"],
    cart: Partial<ICart>
  ): Promise<ICart> {
    const filteredCart = Object.fromEntries(
      Object.entries(cart).filter(([key, value]) => value !== undefined)
    );
    return (await this.cartModel.findByIdAndUpdate(cartId, filteredCart, {
      new: false,
    })) as ICart;
  }
  async removeItemFromCartById(
    cartId: ICart["_id"],
    productId: ICart["items"][0]["productId"]
  ): Promise<ICart | null> {
    // Remove the item from the cart
    await this.cartModel.updateOne(
      { _id: cartId },
      { $pull: { items: { productId } } }
    );

    // Fetch the updated cart
    const updatedCart = await this.cartModel
      .findById(cartId)
      .populate("items.productId");

    if (!updatedCart) {
      throw new Error("Cart not found");
    }

    // If no items left, delete the cart
    if (!updatedCart.items.length) {
      await this.cartModel.findByIdAndDelete(cartId);
      return null; // Indicate cart is deleted
    }

    // Recalculate total
    const newTotal = updatedCart.items.reduce((acc, item) => {
      const product = item.productId as any;
      return acc + (product?.price || 0) * item.quantity;
    }, 0);

    updatedCart.totalPrice = newTotal;
    await updatedCart.save();

    return updatedCart as ICart;
  }
}
