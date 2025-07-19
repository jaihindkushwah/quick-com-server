import { CustomerController } from "@/controller/customer";
import { AddressService } from "@/service/address";
import { CartService } from "@/service/cart";
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
    const cartService = new CartService();
    const customerService = new CustomerService(
      productService,
      addressService,
      orderService,
      cartService
    );
    this.customerController = new CustomerController(customerService);
  }
  routes() {
    this.router.get("/products", this.customerController.getAllProducts);
    this.router.get("/products/:id", this.customerController.getProductById);
    this.router.get("/cart", this.customerController.getAllCartItems);
    this.router.get("/orders", this.customerController.getMyOrders);
    this.router.post("/place-order", this.customerController.placeOrder);
    this.router.post("/add-to-cart", this.customerController.addToCart);
    this.router.post("/create-address", this.customerController.createAddress);
    this.router.post("/remove-address", this.customerController.deleteAddress);
    this.router.post("/update-address", this.customerController.updateAddress);
    this.router.get("/addresses", this.customerController.getAddresses);
    this.router.post(
      "/remove-from-cart",
      this.customerController.removeFromCart
    );
    return this.router;
  }
}
export const customerRoutes = new CustomerRoutes();
