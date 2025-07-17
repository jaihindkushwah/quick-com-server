import { IOrder } from "@/@types/schema";
import { OrderModel } from "@/models/order";

export class OrderService {
    constructor(private readonly orderModel=OrderModel) {}
    async createNewOrder(order: Omit<IOrder, "_id">) : Promise<IOrder> {
        return await this.orderModel.create(order) as IOrder;
    }
    async getAllOrders(): Promise<IOrder[]> {
        return await this.orderModel.find() as IOrder[];
    }
    async getOrderById(orderId: string): Promise<IOrder> {
        return await this.orderModel.findById(orderId) as IOrder;
    }
    async deleteOrderById(orderId: string): Promise<IOrder> {
        return await this.orderModel.findByIdAndDelete(orderId) as IOrder;
    }
    async updateOrderById(orderId,order:Partial<IOrder>): Promise<IOrder> {
        const filteredOrder = Object.fromEntries(Object.entries(order).filter(([key, value]) => value !== undefined));
        return await this.orderModel.findByIdAndUpdate(orderId, filteredOrder, { new: false }) as IOrder;
    }
    async getOrdersByCustomerId(customerId: string): Promise<IOrder[]> {
        return await this.orderModel.find({ customerId }) as IOrder[];
    }
    async getOrdersByDeliveryPartnerId(deliveryPartnerId: string): Promise<IOrder[]> {
        return await this.orderModel.find({ deliveryPartnerId }) as IOrder[];
    }
    
}