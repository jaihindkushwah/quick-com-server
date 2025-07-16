import express from 'express';
import { startServer } from './server';
import { connectDB } from './db';
function start(){
    const app=express();
    connectDB();
    startServer(app);
}
start();