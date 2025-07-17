import { AuthController } from "@/controller/auth";
import { UserService } from "@/service/user";
import { Router } from "express";

export class AuthRoutes {
    private authController: AuthController;
    private router=  Router();
    constructor() {
        const userService= new UserService();
        this.authController= new AuthController(userService);
    }
    routes() {
        this.router.post("/login", this.authController.login);
        this.router.post("/register", this.authController.register);
        // this.router.post("/resend-otp", this.authController.resendOtp);
        // this.router.post("/verify-otp", this.authController.verifyOtp);
        // this.router.post("/reset-password", this.authController.resetPassword);
        // this.router.post("/update-password", this.authController.updatePassword);
        return this.router;
    }
}
export const authRoutes=new AuthRoutes();