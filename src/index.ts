import express from 'express';
import type { Express } from 'express';
import { start } from './server';
import { connectDB } from './db';
async function init(){
    const app:Express=express();
    await connectDB();
    start(app);
}
init();