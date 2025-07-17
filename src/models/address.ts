import { IAddressDocument } from "@/@types/schema";
import { Schema, model } from "mongoose";

const addressSchema = new Schema<IAddressDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String },
  phone: { type: String, required: true, minlength: 10, maxlength: 10 },
  isDefault: { type: Boolean, default: false },
});

export const AddressModel = model<IAddressDocument>("Address", addressSchema);
