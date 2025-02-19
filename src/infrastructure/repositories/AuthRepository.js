import express from "express";
import otpGenerator from "otp-generator";
import User from '../../infrastructure/models/userModel.js'
import Worker from '../../infrastructure/models/workerModel.js'
import OTP from '../models/otpModel.js'
import {mailService} from '../services/emailService.js'

export class AuthRepository{
    constructor(){}

    async create(newUser){
        
        const createdUser = await User.create({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
        });
        
        return new User({ username:createdUser.username, email:createdUser.email,password:createdUser.password});
    }

    async createWorker(newWorker){
        const createWorker = await Worker.create({
            username: newWorker.username,
            email: newWorker.email,
            password: newWorker.password,
            phone: newWorker.phone,
            name: newWorker.name,
            service: newWorker.service,
            experience: newWorker.experience,
            about: newWorker.about,
            profileImage: newWorker.profileImage,
        })
        return new Worker({ username:createWorker.username, email:createWorker.email,password:createWorker.password,
            phone:createWorker.phone, name:createWorker.name,service:createWorker.service,
            experience:createWorker.experience, about:createWorker.about,profileImage:createWorker.profileImage});
    }

    async findUserByEmail(email){
        const user = await User.findOne({email:email});
        return user ? new User({id:user._id, username:user.username, email:user.email, password:user.password}) : null;
    }

    async findWorkerByEmail(email){
        const worker = await Worker.findOne({email:email});
        return worker ? new Worker({id:worker._id,username:worker.username,email:worker.email,password:worker.password}):null
    }



    async generateOtp(email){
    
        const otp = otpGenerator.generate(4, { 
            digits: true, 
            upperCaseAlphabets: false, 
            lowerCaseAlphabets: false, 
            specialChars: false 
        });

        try {
            await OTP.deleteMany({email:email})
            
            const generateAndSaveOtp =await OTP.create({
                email:email,
                otp:otp
            })
            await mailService.sentOTP(email,generateAndSaveOtp.otp)
            return `OTP generated and sent to ${generateAndSaveOtp.email}`;
        } catch (error) {
            console.error("Error saving OTP:", error);
            throw new Error("Unable to save otp");
        }
    }


    async getStoredOtp(email){

        try {
            const otpRecord = await OTP.findOne({email:email})
            if (!otpRecord) {
                return null; 
            }
    
            return otpRecord.otp

        } catch (error) {
            console.error("Error geting OTP:", error);
            throw new Error("Unable to get otp");
        }
       
    }

    async deleteOtp(email){
        try {

            await OTP.deleteOne({email:email})
            return({message:"otp deleted successfull"})

        } catch (error) {
            console.error("Error deleting OTP:", error);
            throw new Error("Unable to deleting otp");
        }
    }


}