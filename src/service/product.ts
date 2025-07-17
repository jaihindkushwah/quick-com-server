import { IProduct } from "@/@types/schema";
import { ProductModel } from "@/models/product";

export class ProductService {
    constructor(private readonly productModel=ProductModel) {}
    async createNewProduct(product: Omit<IProduct, "_id">) : Promise<IProduct> {
        return await this.productModel.create(product) as IProduct;
    }
    async getAllProducts(): Promise<IProduct[]> {
        return await this.productModel.find() as IProduct[];
    }
    async getProductById(productId: string): Promise<IProduct> {
        return await this.productModel.findById(productId) as IProduct;
    }
    async deleteProductById(productId: string): Promise<IProduct> {
        return await this.productModel.findByIdAndDelete(productId) as IProduct;
    }
   async updateProductById(productId:string,product:Partial<IProduct>): Promise<IProduct> {
        const filteredProduct = Object.fromEntries(Object.entries(product).filter(([key, value]) => value !== undefined));
        return await this.productModel.findByIdAndUpdate(productId, filteredProduct, { new: false }) as IProduct;
  }
}