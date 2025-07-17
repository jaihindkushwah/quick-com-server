import { envConfig } from "@/config";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const url = envConfig.MONGODB_URL;
    await mongoose.connect(url);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
}
