import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/AdminController";
import { AdminUseCase } from "../../application/useCases/AdminUseCase";
import { AdminRespository } from "../../infrastructure/repositories/AdminRepository";
import upload from "../../infrastructure/config/multer";
import { authenticateJWT } from "../middlewares/authMiddleware";

const adminRespository = new AdminRespository()
const adminuseCase = new AdminUseCase(adminRespository)
const adminController = new AdminController(adminuseCase); 
const router = Router()

router.post('/login',async(req:Request,res:Response):Promise<void>=>{
    await adminController.login(req,res)
})
router.get('/users',authenticateJWT(['Admin']),async(req:Request,res:Response):Promise<void>=>{
    await adminController.fetchUsers(req,res)
})
router.patch('/users',async(req:Request,res:Response):Promise<void>=>{
    await adminController.toggleBlockUser(req,res)
})

router.get('/workers',authenticateJWT(['Admin','User']),async(req:Request,res:Response):Promise<void>=>{
    await adminController.fetchWorkers(req,res)
})

router.patch('/workers',async(req:Request,res:Response):Promise<void>=>{
    await adminController.toggleBlockWorker(req,res)
})

router.get('/bookings',authenticateJWT(['Admin']),async(req:Request,res:Response):Promise<void>=>{
    await adminController.fetchBookings(req,res)
})
router.patch('/bookings',async(req:Request,res:Response):Promise<void>=>{
    await adminController.toggleCancelBooking(req,res)
})
router.get('/dashboard',async(req:Request,res:Response):Promise<void>=>{
    await adminController.fetchDashboardData(req,res)
})
router.get('/chartData',async(req:Request,res:Response):Promise<void>=>{
    await adminController.fetchChartData(req,res)
})

export default router;