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
router.post('/sentOtp',async (req: Request, res: Response): Promise<void>=>{
    await authController.forgetSentOTP(req,res)
})
router.post('/resend-otp',async (req: Request, res: Response): Promise<void>=>{
    await authController.resentOTP(req,res)
})
router.post('/resendOtp',async (req: Request, res: Response): Promise<void>=>{
    await authController.forgetResentOTP(req,res)
})
router.post('/verify-otp',async(req: Request, res: Response): Promise<void>=>{
    await authController.verifyOTP(req,res)
})
router.post('/register',async (req: Request, res: Response): Promise<void>=>{
    await authController.createUser(req,res)
})
router.post('/worker-register',upload.none(),async(req: Request, res: Response): Promise<void>=>{
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
router.post('/google/register-worker',upload.none(), async (req: Request, res: Response): Promise<void> => {
    await authController.googleCreateWorker(req, res);
});
router.post('/refresh-token',async(req:Request,res:Response):Promise<void>=>{
    await authController.refreshAccessToken(req,res)
})
router.patch('/changePassword',async(req:Request,res:Response):Promise<void>=>{
    await authController.changePassword(req,res)
})
router.post('/logout',async (req:Request,res:Response):Promise<void>=>{
    await authController.logout(req,res)
})



export default router;