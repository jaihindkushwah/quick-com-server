import { OrderDocument } from "@/@types/schema";
import { model, Schema } from "mongoose";

const orderSchema = new Schema<OrderDocument>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deliveryPartnerId: { type: Schema.Types.ObjectId, ref: "User" },
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
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "pickedup",
        "on_the_way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryAddressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDocument>("Order", orderSchema);
