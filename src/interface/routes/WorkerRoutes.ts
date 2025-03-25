import { Router, Request, Response } from "express";
import { WorkerController } from "../controllers/WorkerController";
import { WorkerUseCase } from "../../application/useCases/WorkerUseCase";
import { WorkerRepository } from "../../infrastructure/repositories/WorkerRepository";
import upload from "../../infrastructure/config/multer";
import { authenticateJWT } from "../middlewares/authMiddleware";

const workerRepository = new WorkerRepository()
const workerUseCase = new WorkerUseCase(workerRepository)
const workerController = new WorkerController(workerUseCase); 
const router = Router()

router.get('/data',authenticateJWT(['User','Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.fetchWorker(req,res)
})

router.post('/edit-profile',authenticateJWT(['Worker']),upload.none(),async (req:Request,res:Response):Promise<void>=>{
    await workerController.editProfile(req,res)
})

router.get('/getworker',authenticateJWT(['User']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.getWorker(req,res)
})
router.get('/getJob',authenticateJWT(['Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.getJob(req,res)
})
router.get('/wallet',authenticateJWT(['Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.getWallet(req,res)
})
router.put('/updateJob',authenticateJWT(['Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.updateJob(req,res)
})
router.patch('/updateWork',authenticateJWT(['Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.toggleWorkStatus(req,res)
})
router.patch('/updateReach',authenticateJWT(['Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.toggleReachStatus(req,res)
})
router.patch('/updateAmount',authenticateJWT(['Worker']),async (req:Request,res:Response):Promise<void>=>{
    await workerController.updateAmount(req,res)
})
router.post('/stripe/create-stripe-account',async(req:Request,res:Response):Promise<void>=>{
    await workerController.createStripeAccount(req,res)
})
router.post('/stripe/onboarding-link',async(req:Request,res:Response):Promise<void>=>{
    await workerController.onboardingLink(req,res)
})
router.post('/stripe/testPayout',async(req:Request,res:Response):Promise<void>=>{
    await workerController.testPayout(req,res)
})
router.patch('/updatePassword',async (req:Request,res:Response):Promise<void>=>{
    await workerController.updateWorkerPassword(req,res)
})



export default router;