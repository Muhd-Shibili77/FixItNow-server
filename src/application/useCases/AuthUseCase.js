import express from "express";
import bcrypt from 'bcrypt'
import User from '../../infrastructure/models/userModel.js'
import Worker from '../../infrastructure/models/workerModel.js'

export class AuthUseCase{
    constructor(AuthRepository){
        this.AuthRepository = AuthRepository;
    }
    async sentOTP(newUser){
        const {  email  } = newUser;
        
        const foundUser = await this.AuthRepository.findUserByEmail(email)
        const foundWorker =await this.AuthRepository.findWorkerByEmail(email)
        const isExist = foundUser || foundWorker

        if(isExist){
            throw new Error("Email already exist");
        }

        const otp = await this.AuthRepository.generateOtp(email);
        return { otp };
    }

    async ReSentOTP(newUser){
        const {email} = newUser;
       
        const foundUser = await this.AuthRepository.findUserByEmail(email)
        const foundWorker =await this.AuthRepository.findWorkerByEmail(email)
        const isExist = foundUser || foundWorker

        if(isExist){
            throw new Error("Email already exist");
        }

        

        const otp = await this.AuthRepository.generateOtp(email);
        return {otp}
    }

    async verifyOTP(otp) {
        
        if (!otp.email || !otp.otp) {
            throw new Error("Email and OTP are required");
        }
    
        
        const storedOTP = await this.AuthRepository.getStoredOtp(otp.email);
        
        if (!storedOTP) {
            throw new Error("OTP not found or expired");
        }
    
       
        if (storedOTP !== otp.otp) {
            throw new Error("Invalid OTP");
        }
    
        
        await this.AuthRepository.deleteOtp(otp.email);
    
        return { success: true, message: "OTP verified successfully" };
    }
    



    async register(newUser){
        
        const { username, email, password, conformpassword } = newUser;

        // Validation: Check if all fields are provided
        if (!username || !email || !password || !conformpassword) {
            throw new Error("All fields are required");
        }

        // Validation: Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        // Validation: Password and Confirm Password match
        if (password !== conformpassword) {
            throw new Error("Passwords do not match");
        }

        // Validation: Password strength (min 6 characters)
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }



        
        const hashedPassword = await bcrypt.hash(newUser.password,10)
        const newUserObj  = new User({username: newUser.username, email: newUser.email, password: hashedPassword});
       
        const createdUser = await this.AuthRepository.create(newUserObj );
       
        if (!createdUser._id) {
            throw new Error("Failed to create user");
          }
       
        return { createdUser };
    } 

    async WorkerRegister(worker) {
        const { name, service, experience, phone, about, username, email, password, conformpassword,profileImage } = worker;
    
 
        if (!name || !service || !experience || !phone || !about || !username || !email || !password || !conformpassword || !profileImage) {
            throw new Error("All fields are required");
        }
    
      
        if (name.length < 3) {
            throw new Error("Name must be at least 3 characters long");
        }
    
     
        if (service.trim().length === 0) {
            throw new Error("Service field is required");
        }
    
      
        if (isNaN(experience) || experience <= 0) {
            throw new Error("Experience must be a positive number");
        }
    
       
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Invalid phone number. It must be exactly 10 digits.");
        }
    
       
        if (about.length < 10) {
            throw new Error("About section must be at least 10 characters long");
        }
    
    
        if (username.length < 3) {
            throw new Error("Username must be at least 3 characters long");
        }
    
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }
    
       
        if (password !== conformpassword) {
            throw new Error("Passwords do not match");
        }
    
        
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
    
        const hashedPassword = await bcrypt.hash(password,10)
        const newWorkerOBJ  = new Worker({username:username, email:email, password: hashedPassword,name:name, service:service, experience:experience, phone:phone, about:about,profileImage:profileImage});
       
        const createdWorker = await this.AuthRepository.createWorker(newWorkerOBJ);
       
        if (!createdWorker._id) {
            throw new Error("Failed to create worker");
          }
       
        return { createdWorker };

      
    }
    
    
    async login(user){
       

        const foundUser = await this.AuthRepository.findUserByEmail(user.email)
        const foundWorker = foundUser ? null : await this.AuthRepository.findWorkerByEmail(user.email)

        if(!foundUser && !foundWorker){
            throw new Error("email doesn't exist")
        }
        const account = foundUser || foundWorker

        const isPasswordCorrect = await bcrypt.compare(user.password,account.password)
        
        if(!isPasswordCorrect){
            throw new Error("Incorrect password");
        }
        return {
            username: account.username,
            email: account.email,
            role: foundUser ? "User" : "Worker",
        };
    }
}