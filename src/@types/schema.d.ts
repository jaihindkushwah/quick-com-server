import { Document, Types } from "mongoose";

// User Schema
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  available?: boolean;
  verfied?: boolean;
}

export type UserRole = "admin" | "customer" | "partner";

export interface UserDocument extends Omit<IUser, "_id">, Document {}

// Address Schema types
export interface IAddress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  phone: string;
  isDefault?: boolean;
}

export interface IAddressDocument extends Omit<IAddress, "_id">, Document {}

// Cart Schema types

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  items: ICartItem[];
  totalPrice?: number;
}
export interface CartDocument extends Document, Omit<ICart, "_id"> {}

// Order Schema types

export type OrderStatus =
  | "pending"
  | "accepted"
  | "pickedup"
  | "on_the_way"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  deliveryPartnerId?: Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  deliveryAddressId: Types.ObjectId;
  totalPrice: number;
}

export interface OrderDocument extends Omit<IOrder, "_id">, Document {}

// Product Schema types
export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category?: string;
  isAvailable?: boolean;
}

export interface ProductDocument extends Omit<IProduct, "_id">, Document {}
