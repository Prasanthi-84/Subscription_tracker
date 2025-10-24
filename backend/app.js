// console.log('server running')

import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

import {PORT} from './config/env.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js'
import connectToDatabase from "./database/mangodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";


const app=express();

 app.use(express.json())
 app.use(express.urlencoded({extended:false}))
 app.use(cookieParser())

 app.use(cors({
    //only allow req from this origin
    origin:["http://localhost:3000"],
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    //enable sending cookies
    credentials:true,
 }))

 //bot detection and more
 app.use(arcjetMiddleware)


//endpoints
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/subscriptions',subscriptionRouter)
app.use('/api/v1/workflows',workflowRouter)


app.get('/',(req,res)=>{
    res.send('Welcome to the Subscription Tracker API!')
})


//handle errors
 app.use(errorMiddleware); 


app.listen(PORT,async()=>{
    console.log(`Subscription Tracker API running on http://localhost:${PORT}`)

   await connectToDatabase();
})


export default app;