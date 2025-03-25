import { Router, Request, Response } from "express";
import { ServiceController } from "../controllers/ServiceController";
import { ServiceRepository } from "../../infrastructure/repositories/ServiceRepository";
import { ServiceUseCase } from "../../application/useCases/ServiceUseCase";
import { authenticateJWT } from "../middlewares/authMiddleware";
import serviceIconUpload from "../../infrastructure/config/serviceImageStorage";
const serviceRepository = new ServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepository);
const serviceController = new ServiceController(serviceUseCase);
const router: Router = Router();

router.post("/addService", async (req: Request, res: Response): Promise<void> => {
    await serviceController.addService(req, res);
});

router.post('/upload',serviceIconUpload.single('file'),async(req:Request,res:Response):Promise<void>=>{
    await serviceController.uploadIcon(req,res)
})

router.get("/getService",authenticateJWT(['User','Admin','Worker']),async (req: Request, res: Response): Promise<void> => {
    await serviceController.getService(req, res);
});
router.get("/fetchFullService",async (req: Request, res: Response): Promise<void> => {
    await serviceController.fetchService(req, res);
});

router.patch('/delService',authenticateJWT(['Admin']),async (req:Request,res:Response):Promise<void> =>{
    await serviceController.delService(req,res)
});

router.post('/updateService',authenticateJWT(['Admin']),async (req:Request,res:Response):Promise<void> =>{
    
    await serviceController.updateService(req,res)
});



export default router;
 