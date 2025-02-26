import { Router, Request, Response } from "express";
import { WorkerController } from "../controllers/WorkerController";
import { WorkerUseCase } from "../../application/useCases/WorkerUseCase";
import { WorkerRepository } from "../../infrastructure/repositories/WorkerRepository";
import upload from "../../infrastructure/config/multer";

const workerRepository = new WorkerRepository()
const workerUseCase = new WorkerUseCase(workerRepository)
const workerController = new WorkerController(workerUseCase); 
const router = Router()

router.get('/data',async (req:Request,res:Response):Promise<void>=>{
    await workerController.fetchWorker(req,res)
})

router.post('/edit-profile',upload.single('image'),async (req:Request,res:Response):Promise<void>=>{
    await workerController.editProfile(req,res)
})

router.get('/getworker',async (req:Request,res:Response):Promise<void>=>{
    await workerController.getWorker(req,res)
})
router.get('/getJob',async (req:Request,res:Response):Promise<void>=>{
    await workerController.getJob(req,res)
})
router.put('/updateJob',async (req:Request,res:Response):Promise<void>=>{
    await workerController.updateJob(req,res)
})



export default router;