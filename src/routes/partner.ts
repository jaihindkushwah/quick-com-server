import { PartnerController } from "@/controller/partner";
import { OrderService } from "@/service/order";
import { PartnerService } from "@/service/partner";
import { Router } from "express";

export class PartnerRoutes {
  private readonly router = Router();
  private readonly partnerController: PartnerController;
  constructor() {
    const orderService = new OrderService();
    const partnerService = new PartnerService(orderService);
    this.partnerController = new PartnerController(partnerService);
  }
  routes() {
    this.router.get("/my-orders", this.partnerController.getMyOrders);
    return this.router;
  }
}
export const partnerRoutes = new PartnerRoutes();
