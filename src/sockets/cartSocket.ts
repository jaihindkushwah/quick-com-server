import { ICartItem, OrderStatus } from "@/@types/schema";
import { AddressService } from "@/service/address";
import { authUtilsService } from "@/service/auth.util";
import { CartService } from "@/service/cart";
import { CustomerService } from "@/service/customer";
import { OrderService } from "@/service/order";
import { PartnerService } from "@/service/partner";
import { ProductService } from "@/service/product";
import { Server, Socket } from "socket.io";

interface CartEventData {
  productId: string;
  cartId?: string;
  quantity?: number;
}

export function setupCartSocketEvents(io: Server) {
  const productService = new ProductService();
  const addressService = new AddressService();
  const orderService = new OrderService();
  const cartService = new CartService();
  const partnerService = new PartnerService(orderService);
  const customerService = new CustomerService(
    productService,
    addressService,
    orderService,
    cartService
  );

  io.on("connect", (socket: Socket) => {
    const token = socket.handshake.auth.token;
    let decoded;

    try {
      decoded = token && authUtilsService.verifyToken(token);
      if (!decoded) throw new Error("Token missing or invalid");
    } catch (err) {
      socket.emit("unauthorized", { message: "Token invalid or expired" });
      return socket.disconnect(true);
    }

    const userId = decoded.id;
    const role = decoded.role;

    socket.join(userId);

    if (role === "partner") {
      socket.join("partner-room");
    }

    if (role === "admin") {
      socket.join("admin-room");
    }

    const emitCartUpdate = async () => {
      try {
        const cartData = await cartService.getCartByCustomerId(userId);
        socket.emit("updatedCartData", cartData);
        socket.to(userId).emit("updatedCartData", cartData);
      } catch (err) {
        socket.emit("error", { message: "Failed to update cart" });
      }
    };

    const notifyPartners = (type: string, payload: any) => {
      io.to("partner-room").emit("customerActivity", {
        type,
        userId,
        ...payload
      });
    };

    socket.on("addToCart", async (data: ICartItem) => {
      try {
        if (!data?.productId) throw new Error("Product ID missing");

        await customerService.addToCart(userId, data);
        await emitCartUpdate();
        notifyPartners("cartUpdate", { data });
      } catch (err) {
        socket.emit("error", { message: err.message || "Failed to add to cart" });
      }
    });

    socket.on("removeFromCart", async (data: CartEventData) => {
      try {
        const { productId, cartId } = data;
        if (!productId || !cartId) throw new Error("Product ID or Cart ID missing");

        await customerService.removeFromCart(cartId, productId);
        await emitCartUpdate();
      } catch (err) {
        socket.emit("error", { message: err.message || "Failed to remove from cart" });
      }
    });

    socket.on("placeOrder", async (data: any) => {
      try {
        await customerService.placeOrder(data);
        await emitCartUpdate();
        notifyPartners("orderPlaced", { orderDetails: data });
      } catch (err) {
        socket.emit("error", { message: err.message || "Failed to place order" });
      }
    });

    socket.on("getAllCartItems", async () => {
      try {
        await emitCartUpdate();
      } catch (err) {
        socket.emit("error", { message: "Failed to fetch cart items" });
      }
    });

    socket.on("changeOrderStatus", async (data: { orderId: string; newStatus: OrderStatus }) => {
      try {
        const { orderId, newStatus } = data;
        if (!orderId || !newStatus) throw new Error("Order ID or new status missing");
        
        const updatedOrder = await partnerService.updateOrderStatus(orderId, {status: newStatus});
        const customerId = updatedOrder.customerId.toString();

        io.to(customerId).emit("orderStatusChanged", {
          orderId,
          newStatus,
          updatedAt: new Date()
        });

        io.to("admin-room").emit("orderStatusChanged", {
          orderId,
          newStatus,
          updatedBy: userId,
          updatedAt: new Date()
        });

      } catch (err) {
        socket.emit("error", { message: err.message || "Failed to change order status" });
      }
    });

    socket.on("disconnect", () => {
      socket.leave(userId);
      socket.to("partner-room").emit("partnerDisconnected", userId);
      socket.to("admin-room").emit("adminDisconnected", userId);
      console.log("user disconnected");
    });
  });
}
