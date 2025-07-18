import { ICart, ICartItem, IProduct } from "@/@types/schema";
import { ProductService } from "./product";
import { AddressService } from "./address";
import { OrderService } from "./order";
import { CartService } from "./cart";
import { Types } from "mongoose";

export class CustomerService {
  constructor(
    private readonly productService: ProductService,
    private readonly addressService: AddressService,
    private readonly orderService: OrderService,
    private readonly cartService: CartService
  ) {}

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productService.getAllProducts();
  }
  async getCustomerAddress(customerId: string) {
    return await this.addressService.getAddressByUserId(customerId);
  }
  async placeOrder(productId: string): Promise<any> {
    const product = await this.productService.getProductById(productId);
  }
  async getProductById(
    productId: string,
    customerId: string
  ): Promise<IProduct & { isInCart?: boolean }> {
    const data = await this.productService.getProductById(productId);
    const cartData = await this.cartService.getCartByCustomerId(
      customerId as any
    );
    const isPresentInCart = cartData?.items.some(
      (item) => item.productId.toString() === productId
    );
    const newData = { ...data, isInCart: isPresentInCart };
    return newData;
  }
  async getCustomerOrders(customerId: string) {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }
  async getAllCartItems(customerId: string) {
    return await this.cartService.getCartByCustomerId(customerId as any, true);
  }
  async removeFromCart(cartId: string, productId: string) {
    // calculate total
    return await this.cartService.removeItemFromCartById(
      cartId as any,
      productId as any
    );
  }
  async addToCart(customerId: string, cartInput: ICartItem) {
    const cart = (await this.cartService.getCartByCustomerId(
      customerId as any
    )) as ICart;
    const product = await this.productService.getProductById(
      cartInput.productId as any
    );
    const prodTotal = product.price * cartInput.quantity;
    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === product._id.toString()
      );
      if (existingItem) {
        existingItem.quantity = cartInput.quantity;
        cart.totalPrice = prodTotal || 0;
        return await this.cartService.updateCartById(cart._id, cart);
      }
      cart.items.push(cartInput);
      cart.totalPrice = prodTotal || 0;
      return await this.cartService.updateCartById(cart._id, cart);
    }
    const id = new Types.ObjectId(customerId);
    return await this.cartService.createNewCart({
      customerId: id,
      items: [cartInput],
      totalPrice: prodTotal,
    });
  }
}
