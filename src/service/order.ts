import { IOrder } from "@/@types/schema";
import { OrderModel } from "@/models/order";
import mongoose from "mongoose";
import { OrderStatusEnum } from "./customer";
import loash from "lodash";

export class OrderService {
  constructor(private readonly orderModel = OrderModel) {}
  async createNewOrder(order: Omit<IOrder, "_id">): Promise<IOrder> {
    return (await this.orderModel.create(order)) as IOrder;
  }
  async getAllOrders(populate?: boolean): Promise<IOrder[]> {
    if (populate) {
      const orders = await this.orderModel
        .find()
        .populate({
          path: "customerId",
          select: "_id name email",
        })
        .populate("items.productId")
        .populate({
          path: "deliveryAddressId",
          select: " street city state country zip phone -_id",
        })
        .sort({ createdAt: -1 })
        .lean();

      const flattenedOrders = orders.map((order) => ({
        ...loash.omit(order, ["customerId", "deliveryAddressId"]),
        items: order.items.map((item: any) => ({
          ...item.productId,
          quantity: item.quantity,
          productId: item.productId._id,
        })),
        customerInfo: order.customerId,
        deliveryAddressInfo: order.deliveryAddressId,
      }));
      return flattenedOrders as unknown as IOrder[];
    }
    return await this.orderModel.find();
  }
  async getOrderById(orderId: string): Promise<IOrder> {
    return (await this.orderModel.findById(orderId)) as IOrder;
  }
  async deleteOrderById(orderId: string): Promise<IOrder> {
    return (await this.orderModel.findByIdAndDelete(orderId)) as IOrder;
  }
  async updateOrderById(
    orderId,
    order: Partial<IOrder>,
    session?: mongoose.ClientSession
  ): Promise<IOrder> {
    const filteredOrder = Object.fromEntries(
      Object.entries(order).filter(([key, value]) => value !== undefined)
    );
    return (await this.orderModel.findByIdAndUpdate(orderId, filteredOrder, {
      new: false,
      session,
    })) as IOrder;
  }
  async getAllPendingOrders(): Promise<IOrder[]> {
    return (await this.orderModel.find({
      status: OrderStatusEnum.PENDING,
    })) as IOrder[];
  }
  async acceptOrderById(
    orderId: string,
    order: Partial<IOrder>,
    session?: mongoose.ClientSession
  ): Promise<IOrder | null> {
    const filteredOrder = Object.fromEntries(
      Object.entries(order).filter(([_, value]) => value !== undefined)
    );

    return await this.orderModel.findOneAndUpdate(
      { _id: orderId, status: OrderStatusEnum.PENDING },
      filteredOrder,
      {
        new: true,
        session,
      }
    );
  }
  async getOrdersByCustomerId(customerId: string): Promise<IOrder[]> {
    return (await this.orderModel.find({ customerId })) as IOrder[];
  }
  async getOrdersByDeliveryPartnerId(
    deliveryPartnerId: string
  ): Promise<IOrder[]> {
    return (await this.orderModel.find({ deliveryPartnerId })) as IOrder[];
  }
}
