import { PartnerService } from "@/service/partner";
import { Request, Response } from "express";
import { STATUS_CODES } from "http";

export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {
    this.init();
  }
  init() {
    this.getMyOrders = this.getMyOrders.bind(this);
    this.getUnassignedOrders = this.getUnassignedOrders.bind(this);
    this.acceptOrder = this.acceptOrder.bind(this);
    this.rejectOrder = this.rejectOrder.bind(this);
  }
  async getMyOrders(req: Request, res: Response) {
    try {
      const data = await this.partnerService.getOrdersByPartnerId(
        req.user?.id!
      );
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
  async getUnassignedOrders(req: Request, res: Response) {
    try {
      const data = await this.partnerService.getUnassignedOrders();
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
  async acceptOrder(req: Request, res: Response) {
    try {
      const data = await this.partnerService.acceptOrder(
        req.params.id,
        req.user?.id!
      );
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
  async rejectOrder(req: Request, res: Response) {
    try {
      const data = await this.partnerService.rejectOrder(
        req.params.id,
        req.user?.id!
      );
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
