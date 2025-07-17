import { CustomerService } from "@/service/customer";

export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}
}