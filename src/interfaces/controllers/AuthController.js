import express from "express";


export class AuthController{
    constructor(AuthUseCase){
        this.AuthUseCase = AuthUseCase
    }
    
    async sentOTP(req,res){
        try {
             const {email}=req.body
            
             const response = await this.AuthUseCase.sentOTP({email:email})
             res.json({ success: true, message: "otp sented successfully" ,response});

        } catch (error) {
             console.error(error);
             res.status(400).json({ success: false, message: error.message });
        }
        
    }
    async resentOTP(req,res){
        try {
            const {email}=req.body
            
            const response = await this.AuthUseCase.ReSentOTP({email:email})
             res.json({ success: true, message: "otp re-sented successfully" ,response});

        } catch (error) {
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async verifyOTP(req,res){
        try {
            
            
            const {email,otp}=req.body
            const response = await this.AuthUseCase.verifyOTP({email:email,otp:otp})
            res.json({success:true,message:"otp verified successfully"})

        } catch (error) {
            console.error(error)
            res.status(400).json({success:false,message:error.message})
        }
    }

    async createUser(req,res){

    try{
        const {username,email,password,conformpassword}=req.body
        const response = await this.AuthUseCase.register({username:username,email:email,password:password,conformpassword:conformpassword})
        res.json({ success: true, message: "User registered successfully" ,response});
    }catch(error){
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }     
    }


    async createWorker(req,res){
        try{
           
            const {name,service,experience,phone,about,username,email,password,conformpassword}=req.body
            const image = req.file.filename
            
            const response = await this.AuthUseCase.WorkerRegister({username:username,email:email,password:password,conformpassword:conformpassword,name:name,service:service,experience:experience,phone:phone,about:about,profileImage:image})
            res.json({ success: true, message: "worker registered successfully" ,response});
        }catch(error){
            console.error(error);
            res.status(400).json({ success: false, message: error.message });
        }    
    }

    async loginUser(req,res){

        try{
            const {email,password}=req.body
            const response = await this.AuthUseCase.login({email:email,password:password})
            
            return res.status(200).json({
                success: true,
                message: "Login successful",
                response,
            });

        }catch(error){
            console.error("Login Error:", error);
            const statusCode = error.message === "Email doesn't exist" || error.message === "Incorrect password" ? 401 : 500;
           
            return res.status(statusCode).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }

    }
}