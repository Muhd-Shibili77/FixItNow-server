import { Router, Request, Response } from "express";
import upload from "../../infrastructure/config/multer";
import { ServiceController } from "../controllers/ServiceController";
import { ServiceRepository } from "../../infrastructure/repositories/ServiceRepository";
import { ServiceUseCase } from "../../application/useCases/ServiceUseCase";

const serviceRepository = new ServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepository);
const serviceController = new ServiceController(serviceUseCase);
const router: Router = Router();

router.post("/addService", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
    
    await serviceController.addService(req, res);
});

router.get("/getService", async (req: Request, res: Response): Promise<void> => {
    await serviceController.getService(req, res);
});

export default router;
