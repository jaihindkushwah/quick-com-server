import { IProduct } from "@/@types/schema";
import { OrderService } from "./order";
import { PartnerService } from "./partner";
import { ProductService } from "./product";

export class AdminService {
  constructor(
    private readonly orderService: OrderService,
    private readonly partnerService: PartnerService,
    private readonly productService: ProductService
  ) {}
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
  async getAllPartners() {
    return this.partnerService.getAllPartners();
  }
  async getAllOrderLiveStatus() {}
  async createNewProduct(product: Omit<IProduct, "_id">) {
    return await this.productService.createNewProduct(product);
  }
}
