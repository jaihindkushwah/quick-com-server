import { PartnerController } from "@/controller/partner";
import { PartnerService } from "@/service/partner";
import { Router } from "express";

export class PartnerRoutes{
    private readonly router = Router();
    private readonly partnerController :PartnerController;
    constructor() {
        const partnerService = new PartnerService();
        this.partnerController = new PartnerController(partnerService);
    }
    routes() {
        // this.router.get("/partner", this.partnerController.getPartner);
        return this.router;
    }
}
export const partnerRoutes=new PartnerRoutes();