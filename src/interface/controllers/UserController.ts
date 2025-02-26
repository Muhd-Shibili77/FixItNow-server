import { UserUseCase } from "../../application/useCases/UserUseCase";
import { Request, Response } from "express";

export class UserController {
  constructor(private userUseCase: UserUseCase) {}

  async addAddress(req: Request, res: Response) {
    try {
      const address = req.body;

      const response = await this.userUseCase.addAddress(address);
      res.json({
        success: true,
        message: "address added successfull",
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async getAddress(req: Request, res: Response) {
    try {
      const id = req.query.id as string; // ✅ Ensure `id` is a string
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
   
      const response = await this.userUseCase.getAddress(id);
      
      res.json({
        success: true,
        message: "address fetching successfull",
        response
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async bookWorker(req:Request,res:Response){
    try {
        const {bookingType,workerId,userId,bookAddress} = req.body
        const response = await this.userUseCase.bookWorker(bookingType,workerId,userId,bookAddress);
        res.json({
            success: true,
            message: "worker booked successfull",
            response
          });
    } catch (error:any) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
     
  }

  async getBookings(req:Request,res:Response){

    try {
      
      const id = req.query.id as string;
    
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const response = await this.userUseCase.getBookings(id);
    
      res.json({
        success: true,
        message: "bookings fetching successfull",
        response
      });

 
    } catch (error:any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
    

  }
}
