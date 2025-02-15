import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuteRoutes from './interfaces/routes/AuthRoutes.js'
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

app.use("/auth",AuteRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`server is started at http://localhost:${process.env.PORT}`)
})