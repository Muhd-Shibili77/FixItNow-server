import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { UserUseCase } from "../../application/useCases/UserUseCase";
import Booking from "../../domain/entity/Booking";

const userRepository = new UserRepository();
const userUseCase = new UserUseCase(userRepository);
const userController = new UserController(userUseCase);
const router: Router = Router();

router.post("/addAddress", async (req: Request, res: Response): Promise<void> => {

    await userController.addAddress(req, res);
});

router.get('/getAddress', async (req: Request, res: Response): Promise<void> => {
    await userController.getAddress(req, res);
})

router.post("/book-worker", async (req: Request, res: Response): Promise<void> => {
   
    await userController.bookWorker(req, res);

});

router.get('/getBookings', async (req: Request, res: Response): Promise<void> => {
    await userController.getBookings(req, res);
})


export default router;