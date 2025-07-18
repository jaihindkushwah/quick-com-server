import { CartDocument } from "@/@types/schema";
import { model, Schema } from "mongoose";

const cartSchema = new Schema<CartDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const CartModel = model<CartDocument>("Cart", cartSchema);
