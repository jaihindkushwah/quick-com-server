import { UserDocument } from "@/@types/schema";
import { model, Schema } from "mongoose";

const userSchema=new Schema<UserDocument>(
     {
    name: { type: String, required: true ,trim:true,lowercase:true},
    email: { type: String, required: true, unique: true ,trim:true,lowercase:true},
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'customer', 'partner'],
      required: true,
    },
    available: {
      type: Boolean,
      default: true, // this is only for partner
    },
  },
  { timestamps: true }
)


export const UserModel=model<UserDocument>("User",userSchema);
