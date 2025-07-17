import { CustomerService } from "@/service/customer";
import { Request, Response } from "express";
import { STATUS_CODES } from "http";

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {
    this.init();
  }
  init() {
    this.getAllProducts = this.getAllProducts.bind(this);
    this.getProductById = this.getProductById.bind(this);
    this.getMyOrders = this.getMyOrders.bind(this);
  }
  async getAllProducts(req: Request, res: Response) {
    try {
      const data = await this.customerService.getAllProducts();
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
  async getProductById(req: Request, res: Response) {
    try {
      const data = await this.customerService.getProductById(req.params.id);
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
  async getMyOrders(req: Request, res: Response) {
    try {
      const custId = req.user?.id!;
      if (!custId) {
        res
          .status(400)
          .json({ status: STATUS_CODES.BAD_REQUEST, error: "User not found" });
        return;
      }
      const data = await this.customerService.getCustomerOrders(custId);
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
