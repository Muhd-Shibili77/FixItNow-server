import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import {Server} from 'socket.io'
import { createServer } from "http";
import {initializeSocket} from './infrastructure/config/socket'
import cookieParser from "cookie-parser";
import ServiceRoutes from './interface/routes/ServiceRoutes'
import AuthRoutes from './interface/routes/AuthRoutes'
import WorkerRoutes from './interface/routes/WorkerRoutes'
import UserRoutes from './interface/routes/UserRoutes'
import AdminRoutes from './interface/routes/AdminRoutes'
import MsgRoutes from './interface/routes/MessageRoutes'
import connectDB from "./infrastructure/config/DB";
dotenv.config();

connectDB()
       
const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST'],
    }
})

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  

app.use('/uploads', express.static(path.join(process.cwd(), 'src/infrastructure/fileStorage/profilePic')));

app.use("/auth",AuthRoutes)
app.use('/worker',WorkerRoutes)
app.use('/service',ServiceRoutes)
app.use('/user',UserRoutes)
app.use('/admin',AdminRoutes)
app.use('/msg',MsgRoutes)

initializeSocket(io)


httpServer.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})