import deotenv from 'dotenv';
deotenv.config({override:true});
export class EnvConfig{
    public API_PORT:number;
    public MONGODB_URL:string;
    constructor(){
        this.API_PORT= parseInt(process.env.API_PORT || "3000");
        this.MONGODB_URL=process.env.MONGO_URI || "mongodb://localhost:27017/quick-com"
    }
}

export const envConfig=new EnvConfig();