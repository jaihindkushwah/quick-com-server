import deotenv from 'dotenv';
deotenv.config({override:true});
export class EnvConfig{
    public API_PORT:number;
    public DB_URL:string;
    constructor(){
        this.API_PORT= parseInt(process.env.API_PORT || "3000");
        this.DB_URL=process.env.DB_URL || "mongodb://localhost:27017/quick-com"
    }
}

export const envConfig=new EnvConfig();