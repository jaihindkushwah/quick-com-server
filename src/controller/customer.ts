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
    this.getAllCartItems = this.getAllCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
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
      const data = await this.customerService.getProductById(
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
  async getAllCartItems(req: Request, res: Response) {
    try {
      const data = await this.customerService.getAllCartItems(req.user?.id!);
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
  async placeOrder(req: Request, res: Response) {
    try {
      const data = await this.customerService.placeOrder(req.user?.id!);
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
  async addToCart(req: Request, res: Response) {
    try {
      const data = await this.customerService.addToCart(
        req.user?.id!,
        req.body
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
  async removeFromCart(req: Request, res: Response) {
    try {
      const data = await this.customerService.removeFromCart(
        req.body.cartId,
        req.body.productId
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
