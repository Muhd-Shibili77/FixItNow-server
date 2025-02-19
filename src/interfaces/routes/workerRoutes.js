import express from "express";
import { WorkerController } from "../controllers/workerController.js";
import { WorkerUseCase } from "../../application/useCases/WorkerUseCase.js";
import { WorkerRepository } from "../../infrastructure/repositories/WorkerRepository.js";
import upload from "../../infrastructure/config/multer.js";

const workerRepository = new WorkerRepository()
const workerUseCase = new WorkerUseCase(workerRepository)
const workerController = new WorkerController(workerUseCase); 
const router = express.Router()

router.post('/data',async (req,res)=>{
    await workerController.fetchWorker(req,res)
})

router.post('/edit-profile',upload.single('image'),async (req,res)=>{
    await workerController.editProfile(req,res)
})


export default router;