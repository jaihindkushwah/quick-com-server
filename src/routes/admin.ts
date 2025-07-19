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
    const partnerService = new PartnerService(orderService);
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
    this.router.get("/orders", this.adminController.getAllOrders);
    this.router.get("/partners", this.adminController.getAllPartners);
    this.router.get(
      "/order-live-status",
      this.adminController.getAllOrderLiveStatus
    );
    return this.router;
  }
}
export const adminRoutes = new AdminRoutes();
