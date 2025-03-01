import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthUseCase } from "../../application/useCases/AuthUseCase";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import upload from '../../infrastructure/config/multer'

const authRepository = new AuthRepository()
const authuseCase = new AuthUseCase(authRepository)
const authController = new AuthController(authuseCase); 
const router = Router()

router.post('/sent-otp',async (req: Request, res: Response): Promise<void>=>{
    await authController.sentOTP(req,res)
})

router.post('/verify-otp',async(req: Request, res: Response): Promise<void>=>{
    await authController.verifyOTP(req,res)
})

router.post('/resend-otp',async (req: Request, res: Response): Promise<void>=>{
    await authController.resentOTP(req,res)
})

router.post('/register',async (req: Request, res: Response): Promise<void>=>{
    await authController.createUser(req,res)
})

router.post('/worker-register',upload.single('image'),async(req: Request, res: Response): Promise<void>=>{
    await authController.createWorker(req,res)
})

router.post('/login',async (req: Request, res: Response): Promise<void>=>{
    await authController.loginUser(req,res)
})

router.post('/google', async (req: Request, res: Response): Promise<void> => {
    await authController.googleAuth(req, res);
});
router.post('/google/register-user', async (req: Request, res: Response): Promise<void> => {
    await authController.googleCreateUser(req, res);
});
router.post('/google/register-worker',upload.single('image'), async (req: Request, res: Response): Promise<void> => {
    await authController.googleCreateWorker(req, res);
});

export default router;