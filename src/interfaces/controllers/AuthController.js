import express from "express";


export class AuthController{
    constructor(AuthUseCase){
        this.AuthUseCase = AuthUseCase
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

    async loginUser(req,res){

        try{
            const {email,password}=req.body
            const response = await this.AuthUseCase.login({email:email,password:password})
            res.json({success:true,message:"user login successfull",response})
        }catch(error){
            console.error(error)
            res.status(400).json({success:false,message:error.message})
        }

    }
}