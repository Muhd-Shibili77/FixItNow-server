import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthUseCase } from "../../application/useCases/AuthUseCase.js";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository.js";
// import upload from '../../infrastructure/fileStorage/uploadMiddleware/uploadMiddleware.js'
import upload from '../../infrastructure/config/multer.js'

const authRepository = new AuthRepository()
const authuseCase = new AuthUseCase(authRepository)
const authController = new AuthController(authuseCase); 
const router = express.Router()

router.post('/sent-otp',async (req,res)=>{
    await authController.sentOTP(req,res)
})

router.post('/verify-otp',async(req,res)=>{
    await authController.verifyOTP(req,res)
})

router.post('/resend-otp',async (req,res)=>{
    await authController.resentOTP(req,res)
})

router.post('/register',async (req,res)=>{
    await authController.createUser(req,res)
    
})

router.post('/worker-register',upload.single('image'),async(req,res)=>{
    
    await authController.createWorker(req,res)
})

router.post('/login',async (req,res)=>{
    await authController.loginUser(req,res)
})


export default router;