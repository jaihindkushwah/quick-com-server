import { AdminService } from "@/service/admin";
import { Request, Response } from "express";
import { STATUS_CODES } from "http";

export class AdminController {
  constructor(private readonly adminService: AdminService) {
    this.init();
  }
  init() {
    this.getAllOrderLiveStatus = this.getAllOrderLiveStatus.bind(this);
    this.getAllPartners = this.getAllPartners.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.createNewProduct = this.createNewProduct.bind(this);
  }
  async getAllOrders() {}
  async getAllPartners() {}
  async getAllOrderLiveStatus() {}
  async createNewProduct(req: Request, res: Response) {
    try {
      const data = await this.adminService.createNewProduct(req.body);
      res.status(200).json({ status: STATUS_CODES.OK, data });
    } catch (error) {
      if (error instanceof Error)
        res
          .status(400)
          .json({ status: STATUS_CODES.BAD_REQUEST, error: error.message });
      else
        res.status(400).json({
          status: STATUS_CODES.BAD_REQUEST,
          error: "Something went wrong",
        });
    }
  }
}
