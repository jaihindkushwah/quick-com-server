import {  Router } from "express";
import { health } from "./controller/heath";

export class Routes{
    public router:Router=Router();
    
    init(){
        this.router.get("/health", health);
        return this.router;
    }
    
    
}

export const routes=new Routes();