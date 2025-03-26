import { Request, Response } from "express";
import { WorkerUseCase } from "../../application/useCases/WorkerUseCase";

interface WorkerUpdateData {
  id: string;
  username?: string;
  password?: string;
  conformpassword?: string;
  email?: string;

  
  service: string;
  experience: number;
  phone: number;
  about: string;
  profileImage: string;
}

export class WorkerController {
  constructor(private WorkerUseCase: WorkerUseCase) {}

  async fetchWorker(req: Request, res: Response): Promise<void> {
    try {
      const workerId = req.query.id as string;

      if (!workerId) {
        throw new Error("workerId  is required");
      }

      const response = await this.WorkerUseCase.fetchWorker(workerId);
      res.json({ success: true, message: "worker details fetched", response });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async editProfile(req: Request, res: Response): Promise<void> {
    try {
      const { _id, username, service, experience, phone, about,image } = req.body;
     
      if (!_id || !username || !service || !experience || !phone || !about) {
        throw new Error("All fields are required");
      }
      

      const updateData: WorkerUpdateData = {
        id: _id,
        username,
        service,
        experience,
        phone,
        about,
        profileImage: image
      };

      const response = await this.WorkerUseCase.WorkerProfileEdit(updateData);
      res.json({
        success: true,
        message: "worker profile edited successfully",
        response,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getWorker(req: Request, res: Response): Promise<void> {
    const search: string = (req.query.search as string) || "";
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const id: string = req.query.id as string;

    let query: any = {};

    if (id) {
      query.service = id; // First, filter by the provided worker ID
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Apply search filter within the specific worker ID
    }

    const { workers, totalPages } = await this.WorkerUseCase.getWorker(
      query,
      page,
      limit
    );

    const parsedResponse = workers.map((worker) => ({
      id: worker.id,
      username: worker.username,
      profileImage: worker.profileImage,
      experience: worker.experience,
      service: worker.service,
      averageRating: worker.averageRating,
      totalReviews: worker.totalReviews,
    }));

    res.json({
      success: true,
      message: "worker fetched successfully",
      response: parsedResponse,
      currentPage: page,
      totalPages: totalPages,
    });
  }

  async getJob(req: Request, res: Response) {
    try {
      const id = req.query.id as string;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "worker ID is required" });
      }
      const response = await this.WorkerUseCase.getJob(id);

      res.json({
        success: true,
        message: "jobs fetching successfull",
        response,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const id = req.query.id as string;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "job ID is required" });
      }
      const isAccepted = req.body.isAccepted;
      const response = await this.WorkerUseCase.updateJob(id, isAccepted);

      res.json({
        success: true,
        message: "jobs updated successfull",
        response,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async toggleWorkStatus(req: Request, res: Response) {
    try {
      const bookingId = req.query.bookingId as string | undefined;
      const workStatus = req.query.workStatus as string | undefined;

      if (!bookingId || !workStatus) {
        return res
          .status(400)
          .json({ success: false, message: "Missing bookingId or workStatus" });
      }
      await this.WorkerUseCase.toggleWorkStatus(bookingId, workStatus);
      return res.json({
        success: true,
        message: "work status updated successfull",
      });
    } catch (error: any) {
      console.error("toggle work status Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async toggleReachStatus(req: Request, res: Response) {
    try {
      const bookingId = req.query.bookingId as string | undefined;
      const reachStatus = req.query.reachStatus as string | undefined;

      if (!bookingId || !reachStatus) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Missing bookingId or reachStatus",
          });
      }
      await this.WorkerUseCase.toggleReachStatus(bookingId, reachStatus);
      return res.json({
        success: true,
        message: "reach status updated successfull",
      });
    } catch (error: any) {
      console.error("toggle reach status Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async updateAmount(req: Request, res: Response) {
    try {
      const bookingId = req.query.bookingId as string | undefined;
      const amount = req.query.amount as string | undefined;

      if (!bookingId || !amount) {
        return res
          .status(400)
          .json({ success: false, message: "Missing bookingId or amount" });
      }
      await this.WorkerUseCase.updateAmount(bookingId, amount);
      return res.json({
        success: true,
        message: "amount updated successfull",
      });
    } catch (error: any) {
      console.error("amount updating Error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getWallet(req: Request, res: Response) {
    try {
      const workerId = req.query.workerId as string | undefined;

      if (!workerId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing workerId " });
      }

      const response = await this.WorkerUseCase.getWallet(workerId);
      res.json({
        success: true,
        message: " fetching wallet successfull",
        response,
      });
    } catch (error: any) {
      console.error("wallet fetching error:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createStripeAccount(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId  was required" });
      }

      await this.WorkerUseCase.createStripeAccount(userId)
      res.json({ success: true,message:'stripe account created successfully' });
    } catch (error:any) {
        res.json({ success: false, error: error.message });
    }
  }

  async onboardingLink(req:Request,res:Response){
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: "userId  was required" });
      }

      const response = await this.WorkerUseCase.onboardingLink(userId)
     
      res.json({ success: true,url:response.url });
      
    } catch (error:any) {
      res.json({ success: false, error: error.message });
    }
  }
  async testPayout(req:Request,res:Response){
    try {
      const { userId } = req.body;
     
      if (!userId) {
        return res.status(400).json({ error: "userId  was required" });
      }

      const response = await this.WorkerUseCase.testPayout(userId)
     
      res.json({ success: true});
      
    } catch (error:any) {
      res.json({ success: false, error: error.message });
    }
  }

  async updateWorkerPassword(req:Request,res:Response){
    try {
      
      const userId = req.query.userId as string;
     
      const {currentPassword,newPassword} = req.body;

      await this.WorkerUseCase.updateWorkerPassword(userId,newPassword,currentPassword)

      res.json({
        success:true,
        message:'worker password updated successfull',
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
}
