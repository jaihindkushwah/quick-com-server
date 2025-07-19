import { ICartItem } from "@/@types/schema";
import { BaseSocketHandler } from "./base";
import { CartService } from "@/service/cart";
import { CustomerService } from "@/service/customer";
import { ProductService } from "@/service/product";
import { AddressService } from "@/service/address";
import { OrderService } from "@/service/order";
import { Server, Socket } from "socket.io";

export class CartSocketHandler extends BaseSocketHandler {
  private customerService: CustomerService;
  private cartService: CartService;

  constructor(io: Server, socket: Socket, userId: string, role: string)  {
    super(io, socket, userId, role);
    const productService = new ProductService();
    const addressService = new AddressService();
    const orderService = new OrderService();
    this.cartService = new CartService();
    this.customerService = new CustomerService(productService, addressService, orderService, this.cartService);
  }

  private async emitCartUpdate() {
    const cartData = await this.cartService.getCartByCustomerId(this.userId as any);
    this.socket.emit("updatedCartData", cartData);
    this.socket.to(this.userId).emit("updatedCartData", cartData);
  }

  private notifyPartners(type: string, payload: any) {
    this.io.to("partner-room").emit("customerActivity", {
      type,
      userId: this.userId,
      ...payload
    });
  }

  setupListeners() {
    this.socket.on("addToCart", async (data: ICartItem) => {
      try {
        await this.customerService.addToCart(this.userId, data);
        await this.emitCartUpdate();
        this.notifyPartners("cartUpdate", { data });
      } catch (err) {
        this.socket.emit("error", { message: err.message });
      }
    });

    this.socket.on("removeFromCart", async ({ productId, cartId }) => {
      try {
        await this.customerService.removeFromCart(cartId, productId);
        await this.emitCartUpdate();
      } catch (err) {
        this.socket.emit("error", { message: err.message });
      }
    });

    this.socket.on("getAllCartItems", async () => {
      try {
        await this.emitCartUpdate();
      } catch (err) {
        this.socket.emit("error", { message: err.message });
      }
    });
  }
}
