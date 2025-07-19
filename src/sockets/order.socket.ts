import { BaseSocketHandler } from "./base";
import { CustomerService } from "@/service/customer";
import { PartnerService } from "@/service/partner";
import { OrderService } from "@/service/order";
import { CartService } from "@/service/cart";
import { AddressService } from "@/service/address";
import { ProductService } from "@/service/product";
import { Server, Socket } from "socket.io";

export class OrderSocketHandler extends BaseSocketHandler {
  private customerService: CustomerService;
  private partnerService: PartnerService;

  constructor(io: Server, socket: Socket, userId: string, role: string) {
    super(io, socket, userId, role);
    const productService = new ProductService();
    const addressService = new AddressService();
    const orderService = new OrderService();
    const cartService = new CartService();
    this.partnerService = new PartnerService(orderService);
    this.customerService = new CustomerService(
      productService,
      addressService,
      orderService,
      cartService
    );
  }

  setupListeners() {
    this.socket.on("placeOrder", async (data: any) => {
      try {
        await this.customerService.placeOrder(data);
        this.io.to("partner-room").emit("orderPlaced", { orderDetails: data });
      } catch (err) {
        this.socket.emit("error", { message: err.message });
      }
    });

    this.socket.on("changeOrderStatus", async ({ orderId, newStatus }) => {
      try {
        const updatedOrder = await this.partnerService.updateOrderStatus(
          orderId,
          { status: newStatus }
        );
        const customerId = updatedOrder.customerId.toString();

        this.io.to(customerId).emit("orderStatusChanged", {
          orderId,
          newStatus,
          updatedAt: new Date(),
        });
        this.io.to("admin-room").emit("orderStatusChanged", {
          orderId,
          newStatus,
          updatedBy: this.userId,
          updatedAt: new Date(),
        });
      } catch (err) {
        this.socket.emit("error", { message: err.message });
      }
    });
  }
}
