import { IUser } from "@/@types/schema";
import { UserModel } from "@/models/user";
import { OrderService } from "./order";
import mongoose, { Types } from "mongoose";
import { OrderStatusEnum } from "./customer";

export class PartnerService {
  private readonly userModel = UserModel;
  constructor(private readonly orderService: OrderService) {}
  getAllPartners() {
    return this.userModel.find({ role: "partner" }, "-password");
  }
  getPartnerById(id: string) {
    return this.userModel.findById(id);
  }
  updatePartnerById(id: string, data: Partial<IUser>) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
  async getOrdersByPartnerId(partnerId: string) {
    return this.orderService.getOrdersByDeliveryPartnerId(partnerId);
  }
  async getUnassignedOrders() {
    return this.orderService.getAllPendingOrders();
  }
  async acceptOrder(id: string, deliveryPartnerId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedOrder = await this.orderService.acceptOrderById(
        id,
        {
          status: OrderStatusEnum.ACCEPTED,
          deliveryPartnerId: new Types.ObjectId(deliveryPartnerId),
        },
        session
      );
      await session.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  async rejectOrder(id: string, deliveryPartnerId: string) {}
}
