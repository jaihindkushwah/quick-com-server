import { IProduct } from "@/@types/schema";
import { ProductService } from "./product";
import { AddressService } from "./address";
import { OrderService } from "./order";

export class CustomerService {
  constructor(
    private readonly productService: ProductService,
    private readonly addressService: AddressService,
    private readonly orderService: OrderService
  ) {}

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productService.getAllProducts();
  }
  async getCustomerAddress(customerId: string) {
    return await this.addressService.getAddressByUserId(customerId);
  }
  async placeOrder(productId: string): Promise<any> {
    const product = await this.productService.getProductById(productId);
  }
  async getProductById(productId: string): Promise<IProduct> {
    return await this.productService.getProductById(productId);
  }
  async getCustomerOrders(customerId: string) {
    return await this.orderService.getOrdersByCustomerId(customerId);
  }
}
