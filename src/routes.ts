import {  Application } from "express";
import { health } from "./controller/heath";
import { authRoutes } from "./routes/auth";
import { adminRoutes } from "./routes/admin";
import { customerRoutes } from "./routes/customer";
import { partnerRoutes } from "./routes/partner";

export class Routes{
    private BASE_ROUTE="/api/v1";
    init(app:Application):void{
        app.use(this.BASE_ROUTE+"/health",health);
        app.use(this.BASE_ROUTE+"/auth",authRoutes.routes());
        app.use(this.BASE_ROUTE+"/admin",adminRoutes.routes());
        app.use(this.BASE_ROUTE+"/customer",customerRoutes.routes());
        app.use(this.BASE_ROUTE+"/partner",partnerRoutes.routes());
    }
    
    
}

export const routes=new Routes();