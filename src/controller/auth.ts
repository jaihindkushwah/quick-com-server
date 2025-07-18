import { UserService } from "@/service/user";
import { Request, Response ,} from "express";
import { STATUS_CODES } from "http";

export class AuthController {
    constructor(private readonly userService: UserService) {
        this.init();
    }
    init(){
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.resendOtp = this.resendOtp.bind(this);
    }
    async login(req: Request, res: Response) {
        try {
            const data=await this.userService.login({
                email: req.body.email,
                password: req.body.password,
                role: req.body.role || "partner",
            });
            res.status(200).json({  status:STATUS_CODES.OK, data });
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({  status:STATUS_CODES.BAD_REQUEST, error: error.message });
            }
            else{
                res.status(400).json({  status:STATUS_CODES.BAD_REQUEST, error: "Something went wrong" });
            }
        }
    }
    async register(req: Request, res: Response) {
        try {
            const data=await this.userService.register({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                role: req.body.role,
            });
            res.status(200).json({  status:STATUS_CODES.OK, data });
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({  status:STATUS_CODES.BAD_REQUEST, error: error.message });
            }
            else{
                res.status(400).json({  status:STATUS_CODES.BAD_REQUEST, error: "Something went wrong" });
            }
        }
    }
    async resendOtp(req: Request, res: Response) {
        try {
            const data=await this.userService.resendOtp(req.body.email);
            res.status(200).json({  status:STATUS_CODES.OK, data });
        } catch (error) {
            if(error instanceof Error){
                res.status(400).json({  status:STATUS_CODES.BAD_REQUEST, error: error.message });
            }
            else{
                res.status(400).json({  status:STATUS_CODES.BAD_REQUEST, error: "Something went wrong" });
            }
        }
    }
}