import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path'
import AuteRoutes from './interfaces/routes/AuthRoutes.js'
import WorkerRoutes from './interfaces/routes/workerRoutes.js'
import connectDB from "./infrastructure/config/DB.js";
dotenv.config();

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}));


app.use('/uploads', express.static(path.join(process.cwd(), 'src/infrastructure/fileStorage/profilePic')));

app.use("/auth",AuteRoutes)
app.use('/worker',WorkerRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})