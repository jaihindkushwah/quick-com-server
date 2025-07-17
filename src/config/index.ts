import deotenv from 'dotenv';
deotenv.config({override:true});
export class EnvConfig{
    public API_PORT:number;
    public MONGODB_URL:string;
    public JWT_SECRET_KEY:string;
    constructor(){
        this.API_PORT= parseInt(process.env.API_PORT || "3000");
        this.MONGODB_URL=process.env.MONGO_URI || "mongodb://localhost:27017/quick-com"
        this.JWT_SECRET_KEY=process.env.JWT_SECRET_KEY || "secret"
    }
}

export const envConfig=new EnvConfig();