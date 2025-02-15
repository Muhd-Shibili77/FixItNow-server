import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { AuthUseCase } from "../../application/useCases/AuthUseCase.js";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository.js";
const authRepository = new AuthRepository()
const authuseCase = new AuthUseCase(authRepository)
const authController = new AuthController(authuseCase); 
const router = express.Router()


router.post('/register',async (req,res)=>{
    await authController.createUser(req,res)
    
})

router.post('/login',async (req,res)=>{
    await authController.loginUser(req,res)
})


export default router;