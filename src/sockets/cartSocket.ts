import { AddressService } from "@/service/address";
import { authUtilsService } from "@/service/auth.util";
import { CartService } from "@/service/cart";
import { CustomerService } from "@/service/customer";
import { OrderService } from "@/service/order";
import { ProductService } from "@/service/product";
import { Server } from "socket.io";

export function setupCartSocketEvents(io: Server) {
  const productService: ProductService = new ProductService();
  const addressService: AddressService = new AddressService();
  const orderService: OrderService = new OrderService();
  const cartService: CartService = new CartService();
  const customerService = new CustomerService(
    productService,
    addressService,
    orderService,
    cartService
  );

  io.on("connect", (socket) => {
    const token = socket.handshake.auth.token;
    const decoded =
      token &&
      (authUtilsService.verifyToken(token) as {
        id: string;
        email: string;
        role: string;
        avialable: boolean;
        name: string;
      });

    if (!decoded) {
      socket.disconnect(true);
      return;
    }

    const userId = decoded.id;
    socket.join(userId);

    socket.on("addToCart", async (data) => {
      try {
        const result = await customerService.addToCart(userId, data);
        socket.emit("updatedCartData", result);
        socket.to(userId).emit("updatedCartData", result);
      } catch (err) {
        console.error("addToCart error:", err);
        socket.emit("error", { message: "Failed to add to cart" });
      }
    });

    socket.on("placeOrder", async (data) => {
      try {
        await customerService.placeOrder(data);
        const cartData = await cartService.getCartByCustomerId(userId);
        socket.emit("updatedCartData", cartData);
        socket.to(userId).emit("updatedCartData", cartData);
      } catch (err) {
        console.error("addToCart error:", err);
        socket.emit("error", { message: "Failed to add to cart" });
      }
    });

    socket.on("removeFromCart", async (data) => {
      try {
        const { productId, cartId } = data;
        const result = await customerService.removeFromCart(cartId, productId);
        socket.emit("updatedCartData", result);
        socket.to(userId).emit("updatedCartData", result);
      } catch (err) {
        console.error("addToCart error:", err);
        socket.emit("error", { message: "Failed to add to cart" });
      }
    });
    socket.on("getAllCartItems", (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
