import { ProductDocument } from "@/@types/schema";
import { model, Schema } from "mongoose";

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ProductModel = model<ProductDocument>('Product', productSchema);
