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
        const {bookingType,date,workerId,userId,bookAddress,userLocation} = req.body
        const response = await this.userUseCase.bookWorker(bookingType,date,workerId,userId,bookAddress,userLocation);
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

  async createPaymentIntent(req:Request,res:Response){
      try {
        
        const { amount, bookingId,bookingNO,user,address } = req.body;
        
        if (!amount || !bookingId || !bookingNO) {
          return res.status(400).json({ error: "Amount and Booking ID or No are required" });
       }
       if(!user || !address){
        return res.status(400).json({error:"user's name and user address are required"})
       }
       
        const response = await this.userUseCase.createPayment(bookingId,bookingNO,amount,user,address)
        res.json({ clientSecret: response.client_secret });
      } catch (error:any) {
        res.status(500).json({ error: error.message });
      }
  }

  async makePayment(req:Request,res:Response){
    try {
      const {bookingId,amount}=req.body

      if(!bookingId){
        return res.status(400).json({error:"bookingId is empty"})
      }
      if(!amount){
        return res.status(400).json({error:"amount is empty"})
      }

      await this.userUseCase.makePayment(bookingId,amount)
      res.json({
        success: true,
        message: "payment is successfull",
      });
      
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async rateReview(req:Request,res:Response){
    try {

      const {user,worker,booking,rating,review} = req.body

      await this.userUseCase.rateReview(user,worker,booking,rating,review)

      res.json({
        success: true,
        message: "review successfully sent",
      });
      
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReview(req:Request,res:Response){
    try {

      const workerId = req.query.workerId as string;

      const response = await this.userUseCase.getReview(workerId)

      res.json({
        success: true,
        message: "review successfully fetch",
        response
      });
      
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async userInfo (req:Request,res:Response){

    try {

      const userId = req.query.id as string;

      const response = await this.userUseCase.userInfo(userId)
  
      res.json({
        success:true,
        message:'User data fetched successfull',
        response
      })
      
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
   
  }

  async updateUser (req:Request,res:Response){
    try {

      const userId = req.query.id as string;
      const {username,profileImage} = req.body;
      const phone = parseInt(req.body.phone)  
     
      const response = await this.userUseCase.updateUserInfo(userId,username,phone,profileImage)
      res.json({
        success:true,
        message:'User data updated successfull',
        response
      })
      
    } catch (error:any) {
      res.status(500).json({ error: error.message });
    }
  }

  async uploadProfile(req:Request,res:Response){
    try {
      if(!req.file){
        throw new Error('file is missing')
      }
      res.json({url:req.file.path})
      
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'File upload failed' });
  }
  }

  async updateUserPassword(req:Request,res:Response){

    try {
      const userId = req.query.userId as string;
     
      const {currentPassword,newPassword} = req.body;

      await this.userUseCase.updateUserPassword(userId,newPassword,currentPassword)
      res.json({
        success:true,
        message:'User data updated successfull',
      })
      
    } catch (error) {
      console.error('Password update error:', error);
      if (error instanceof Error) {
        return res.status(400).json({ 
          success: false, 
          message: error.message 
        });
      }
      
      
      res.status(500).json({ 
        success: false, 
        message: 'Password update failed' 
      });
     }
  }

  async getLocation(req:Request,res:Response){
    try {
      const bookingId = req.query.bookingId as string;
      
      const booking = await this.userUseCase.userLocation(bookingId)
      
      if(!booking || !booking.userLocation){
        throw new Error('location not found')
      }
      res.json({
        success:true,
        message:'User data updated successfull',
        userLocation: booking.userLocation,
      })

    }  catch (error) {
      console.error('location error:', error);
      res.status(500).json({ message: 'location fetching failed' });
  }
  }

  
}
