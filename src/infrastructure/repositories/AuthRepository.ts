
import otpGenerator from "otp-generator";
import UserModel from "../models/userModel";
import WorkerModel from "../models/workerModel";
import OTP from '../models/otpModel'
import {mailService} from '../services/emailService'
import User from "../../domain/entity/User";
import Worker from "../../domain/entity/Worker";
import { IAuthRepository } from "../../application/Interfaces/IAuthinterfaces";


export class AuthRepository implements IAuthRepository{

    async create(newUser:User):Promise<User>{
        
        const createdUser = await UserModel.create({
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
        });
        return createdUser
    }

    async createWorker(newWorker:Worker):Promise<Worker>{
        
        const createWorker = await WorkerModel.create({
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
        
       return  createWorker
    }

    async findUserByEmail(email:string):Promise<User | null >{
        const user = await UserModel.findOne({email:email});
        if(!user){
            return null
        }
        return new User({id:user.id,username: user.username, email: user.email,password:user.password})
    }

    async findWorkerByEmail(email:string):Promise<Worker | null>{
        const worker = await WorkerModel.findOne({email:email});
        if(!worker){
            return null
        }
        return new Worker({id:worker.id,username: worker.username, email: worker.email,password:worker.password})
    }



    async generateOtp(email:string):Promise<string>{
    
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


    async getStoredOtp(email:string):Promise<string | null>{

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

    async deleteOtp(email: string): Promise<{ message: string }> {
        try {

            await OTP.deleteOne({email:email})
            return({message:"otp deleted successfull"})

        } catch (error) {
            console.error("Error deleting OTP:", error);
            throw new Error("Unable to deleting otp");
        }
    }

    async createGoogleUser(username: string, email: string): Promise<User> {
        const createUser = await UserModel.create({
            username :username,
            email:email,
            isGoogleAuth:true,
        })
        return createUser
    }

    async createGoogleWorker(username: string, email: string, name: string, service: string, experience: number, phone: number, about: string, profileImage: string): Promise<Worker> {
        const createWorker = await WorkerModel.create({
            username: username,
            email: email,
            phone: phone,
            name: name,
            service: service,
            experience: experience,
            about: about,
            profileImage: profileImage,
            isGoogleAuth:true,
        })
        
       return  createWorker
    }

    


}