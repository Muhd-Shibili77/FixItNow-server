import { Request, Response } from "express";
import { AuthUseCase } from "../../application/useCases/AuthUseCase";



export class AuthController{
     constructor(private AuthUseCase: AuthUseCase) {}
    
    async sentOTP(req:Request,res:Response):Promise<void>{
        try {
             const email:string = req.body.email
             const response = await this.AuthUseCase.sentOTP({email})
             res.json({ success: true, message: "otp sented successfully" ,response});

        } catch (error:any) {
             console.error(error);
             res.status(400).json({ success: false, message: error.message });
        }
        
    }
    async resentOTP(req:Request,res:Response):Promise<void>{
        try {
            const email:string = req.body.email
            
            const response = await this.AuthUseCase.ReSentOTP({email})
             res.json({ success: true, message: "otp re-sented successfully" ,response});

        } catch (error:any) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async verifyOTP(req: Request, res: Response): Promise<void> {
        try {
            
            
            const {email,otp}=req.body
            await this.AuthUseCase.verifyOTP({email:email,otp:otp})
            res.json({success:true,message:"otp verified successfully"})

        } catch (error:any) {
            console.error(error)
            res.status(400).json({success:false,message:error.message})
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
    try{
        const {username,email,password,conformpassword} =req.body
        const response = await this.AuthUseCase.register({username,email,password,conformpassword})
        res.json({ success: true, message: "User registered successfully" ,response,Token:response.Token});
    }catch(error:any){
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }     
    }


    async createWorker(req: Request, res: Response): Promise<void> {
        try{
           
            const {name,service,experience,phone,about,username,email,password,conformpassword} =req.body
            const image: string = req.file?.filename || "";

            
            const response = await this.AuthUseCase.WorkerRegister({username,email,password,conformpassword,name,service,experience,phone,about,profileImage:image})
            
            res.json({ success: true, message: "worker registered successfully" ,response,Token:response.Token});
        }catch(error:any){
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }    
    }

    async loginUser(req: Request, res: Response): Promise<Response> {

        try{
            const {email,password} =req.body
            const response = await this.AuthUseCase.login({email,password})
            
            
            return res.status(200).json({
                success: true,
                message: "Login successful",
                response,
                Token:response.Token,
            });

        }catch(error:any){
            console.error("Login Error:", error);
            const statusCode = error.message === "Email doesn't exist" || error.message === "Incorrect password" ? 401 : 500;
           
            return res.status(statusCode).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }

    }
}