import { envConfig } from "@/config";
import mongoose from "mongoose";

export function connectDB() {
    mongoose.connect(envConfig.MONGODB_URL)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err))
}