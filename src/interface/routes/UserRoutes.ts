import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import Booking from "../../domain/entity/Booking";
import { authenticateJWT } from "../middlewares/authMiddleware";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);
const router: Router = Router();

router.post("/addAddress",authenticateJWT(['User']), async (req: Request, res: Response): Promise<void> => {

    await userController.addAddress(req, res);
});

router.get('/getAddress',authenticateJWT(['User']), async (req: Request, res: Response): Promise<void> => {
    await userController.getAddress(req, res);
})

router.post("/book-worker",authenticateJWT(['User']), async (req: Request, res: Response): Promise<void> => {
    await userController.bookWorker(req, res);
});

router.get('/getBookings',authenticateJWT(['User']),async (req: Request, res: Response): Promise<void> => {
    await userController.getBookings(req, res);
})

router.post('/stripe/create-payment',async(req:Request,res:Response):Promise<void>=>{
    await userController.createPaymentIntent(req,res)
})
router.post('/makePayment',async(req:Request,res:Response):Promise<void>=>{
    await userController.makePayment(req,res)
})

export default router;