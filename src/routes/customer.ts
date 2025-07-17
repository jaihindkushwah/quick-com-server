import { CustomerController } from "@/controller/customer";
import { AddressService } from "@/service/address";
import { CustomerService } from "@/service/customer";
import { OrderService } from "@/service/order";
import { ProductService } from "@/service/product";
import { Router } from "express";

export class CustomerRoutes {
  private readonly router = Router();
  private readonly customerController: CustomerController;
  constructor() {
    const productService = new ProductService();
    const addressService = new AddressService();
    const orderService = new OrderService();
    const customerService = new CustomerService(
      productService,
      addressService,
      orderService
    );
    this.customerController = new CustomerController(customerService);
  }
  routes() {
    this.router.get("/products", this.customerController.getAllProducts);
    this.router.get("/products/:id", this.customerController.getProductById);
    this.router.get("/orders", this.customerController.getMyOrders);
    return this.router;
  }
}
export const customerRoutes = new CustomerRoutes();
