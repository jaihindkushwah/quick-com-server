import Express from 'express';
import { envConfig } from './config';
function start(){
    const app=Express();
    const port=envConfig.API_PORT;
    app.listen(port,()=>console.log(`Server is running ${port}`));
}
start();