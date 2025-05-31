import { Request,Response } from "express";
import { AdminUseCase } from "../../application/useCases/AdminUseCase";
import { StatusCode } from "../../application/constant/statusCode";
export class AdminController{
    constructor(private AdminUseCase :AdminUseCase){}

    async login (req:Request,res:Response){
        try {
            const {email,password} = req.body
            const response = await this.AdminUseCase.login({email,password})
            

            res.cookie('refreshToken',response.refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite: 'none',
                maxAge:7 * 24 * 60 * 60 * 1000,
            });

            return res.status(StatusCode.OK).json({
                success: true,
                message: "Login successful",
                response,
                Token:response.Token,
            })
            
        } catch (error:any) {
            console.error("Login Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async fetchUsers(req:Request,res:Response){
        try {
           
          const search: string = (req.query.search as string) || "";
          const page: number = parseInt(req.query.page as string) || 1;
          const limit: number = parseInt(req.query.limit as string) || 10;

          const query = search ? { username: { $regex: search, $options: "i" } } : {};

            const {users,totalPages} = await this.AdminUseCase.fetchUsers(query,page,limit)
            return res.status(StatusCode.OK).json({
                success: true,
                message: "users list fetching successfull",
                response:users,
                currentPage: page,
                totalPages: totalPages
              });
        } catch (error:any) {
            console.error("fetching user Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
    async fetchWorkers(req:Request,res:Response){
        try {
            const search: string = (req.query.search as string) || "";
          const page: number = parseInt(req.query.page as string) || 0;
          const limit: number = parseInt(req.query.limit as string) || 0;
          

          const query = search ? { name: { $regex: search, $options: "i" } } : {};
            
          
            const {workers,totalPages} = await this.AdminUseCase.fetchWorkers(query,page,limit)
            return res.status(StatusCode.OK).json({
                success: true,
                message: "worker list fetching successfull",
                response:workers,
                currentPage: page,
                totalPages: totalPages
              });
        } catch (error:any) {
            console.error("fetching worker Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
    async fetchBookings(req:Request,res:Response){
        try {
            const search: string = (req.query.search as string) || "";
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            
            const query = search ? { bookingNo: { $regex: search, $options: "i" } } : {};

            const {bookings,totalPages} = await this.AdminUseCase.fetchBookings(query,page,limit)
            return res.status(StatusCode.OK).json({
                success: true,
                message: "booking list fetching successfull",
                response:bookings,
                currentPage: page,
                totalPages: totalPages
              });
        } catch (error:any) {
            console.error("fetching bookings Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async toggleBlockUser(req:Request,res:Response){
        try {
            
            const actions = req.query.actions as string | undefined;
            const id = req.query.id as string | undefined;
    
            if (!actions || !id) {
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Missing actions or id" });
            }

            await this.AdminUseCase.toggleBlockUser(actions,id)
            return res.status(StatusCode.OK).json({
                success: true,
                message: "user toggle block successfull",
            });
        } catch (error:any) {
            console.error("toggle block user Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
    async toggleBlockWorker(req:Request,res:Response){
        try {
            
            const actions = req.query.actions as string | undefined;
            const id = req.query.id as string | undefined;
    
            if (!actions || !id) {
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Missing actions or id" });
            }

            await this.AdminUseCase.toggleBlockWorker(actions,id)
            return res.status(StatusCode.OK).json({
                success: true,
                message: "worker toggle block successfull",
            });
        } catch (error:any) {
            console.error("toggle block worker Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async toggleCancelBooking(req:Request,res:Response){
        try {
            const bookingId = req.query.id as string 
            
            await this.AdminUseCase.toggleCancelBooking(bookingId)
            return res.status(StatusCode.OK).json({
                success: true,
                message: "cancel booking successfull",
            });
        } catch (error:any) {
            console.error("toggle cancel booking Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async fetchDashboardData(req:Request,res:Response){
        try {

            const response = await this.AdminUseCase.fetchDashboardData()

            return res.status(StatusCode.OK).json({
                success: true,
                message: "fetching details successfull",
                response
            });

        } catch (error:any) {
            console.error("fetch dashboard details error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }

    async fetchChartData(req:Request,res:Response){
        try {

            const response = await this.AdminUseCase.fetchChartData()
            return res.status(StatusCode.OK).json({
                success: true,
                message: "fetching chart data successfull",
                response
            })
            
        } catch (error:any) {
            console.error("fetch chart  data error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
    
    async fetchEarnings(req:Request,res:Response){
        try {
            const search: string = (req.query.search as string) || "";
            const page: number = parseInt(req.query.page as string) || 1;
            const limit: number = parseInt(req.query.limit as string) || 10;
            
            const query = search ? { bookingNo: { $regex: search, $options: "i", paymentStatus:true } } : { paymentStatus:true };

            const {bookings,totalPages} = await this.AdminUseCase.fetchEarnings(query,page,limit)
            
            return res.status(StatusCode.OK).json({
                success: true,
                message: "earnings list fetching successfull",
                response:bookings,
                currentPage: page,
                totalPages: totalPages
              });
        } catch (error:any) {
            console.error("fetching earnins Error:", error);
            res.status(StatusCode.BAD_REQUEST).json({ success: false, message: error.message });
        }
    }
}