import { CustomerController } from "@/controller/customer";
import { CustomerService } from "@/service/customer";
import { Router } from "express";

export class CustomerRoutes {
    private readonly router = Router();
    private readonly customerController :CustomerController;
    constructor() {
        const customerService = new CustomerService();
        this.customerController = new CustomerController(customerService);
    }
    routes() {
        // this.router.get("/customer", this.customerController.getCustomer);
        return this.router;
    }
}
export const customerRoutes=new CustomerRoutes();