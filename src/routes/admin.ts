import { AdminController } from "@/controller/admin";
import { AdminService } from "@/service/admin";
import { OrderService } from "@/service/order";
import { PartnerService } from "@/service/partner";
import { ProductService } from "@/service/product";
import { Router } from "express";

export class AdminRoutes {
  private router = Router();
  private adminController: AdminController;
  constructor() {
    const orderService = new OrderService();
    const partnerService = new PartnerService();
    const productService = new ProductService();
    const adminService = new AdminService(
      orderService,
      partnerService,
      productService
    );
    this.adminController = new AdminController(adminService);
  }
  routes() {
    this.router.post("/create-product", this.adminController.createNewProduct);
    return this.router;
  }
}
export const adminRoutes = new AdminRoutes();
