import { AdminController } from "@/controller/admin";
import { AdminService } from "@/service/admin";
import { Router } from "express";

export class AdminRoutes {
    private router=  Router();
    private adminController:AdminController;
    constructor() {
        const adminService= new AdminService();
        this.adminController= new AdminController(adminService);
    }
    routes() {
        // this.router.get("/admin", this.adminController.getAdmin);
        return this.router;
    }
}
export const adminRoutes=new AdminRoutes();