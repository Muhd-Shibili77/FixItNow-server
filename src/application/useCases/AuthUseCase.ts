import bcrypt from 'bcrypt'
import { IAuthRepository } from '../Interfaces/IAuthinterfaces';
import jwtService from '../../infrastructure/services/jwtService'
import User from '../../domain/entity/User';
import Worker from '../../domain/entity/Worker';


interface LoginUser{
    email:string,
    password:string
}

export class AuthUseCase{
    constructor(private authRepository: IAuthRepository) {}

    async sentOTP(newUser:Pick<User,'email'>):Promise<{otp:string}>{
        const {  email  } = newUser;
        
        const foundUser = await this.authRepository.findUserByEmail(email)
        const foundWorker =await this.authRepository.findWorkerByEmail(email)
        const isExist = foundUser || foundWorker

        if(isExist){
            throw new Error("Email already exist");
        }

        const otp = await this.authRepository.generateOtp(email);
        return { otp };
    }


    async ReSentOTP(newUser:Pick<User,'email'>):Promise<{otp:string}>{
        const {email} = newUser;
       
        const foundUser = await this.authRepository.findUserByEmail(email)
        const foundWorker =await this.authRepository.findWorkerByEmail(email)
        const isExist = foundUser || foundWorker

        if(isExist){
            throw new Error("Email already exist");
        }

        

        const otp = await this.authRepository.generateOtp(email);
        return {otp}
    }

    async verifyOTP(otp: { email: string; otp: string }): Promise<{ success: boolean; message: string }> {
        
        if (!otp.email || !otp.otp) {
            throw new Error("Email and OTP are required");
        }
    
        
        const storedOTP = await this.authRepository.getStoredOtp(otp.email);
        
        if (!storedOTP) {
            throw new Error("OTP not found or expired");
        }
    
       
        if (storedOTP !== otp.otp) {
            throw new Error("Invalid OTP");
        }
    
        
        await this.authRepository.deleteOtp(otp.email);
    
        return { success: true, message: "OTP verified successfully" };
    }
    



    async register(newUser:User):Promise<{createdUser: User; Token: string}>{
        
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

        const foundUser = await this.authRepository.findUserByEmail(email)
        const foundWorker =await this.authRepository.findWorkerByEmail(email)

        if(foundUser || foundWorker){
            throw new Error("email already exist")
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
        const newUserObj  = { ...newUser, password: hashedPassword}
       
        const createdUser = await this.authRepository.create(newUserObj );
        
        if (!createdUser.id) {
            throw new Error("Failed to create user");
          }

        const role = 'User'  
        const Token = jwtService.generateToken(createdUser.id,role)

       
        return { createdUser,Token };
    } 

    async WorkerRegister(worker:Worker):Promise<{createdWorker:Worker,Token:string}> {
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
    
       
        const phoneString = String(phone);

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneString)) {
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

        const foundUser = await this.authRepository.findUserByEmail(email)
        const foundWorker =await this.authRepository.findWorkerByEmail(email)

        if(foundUser || foundWorker){
            throw new Error("email already exist")
        }
    
       
        if (password !== conformpassword) {
            throw new Error("Passwords do not match");
        }
    
        
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
    
        const hashedPassword = await bcrypt.hash(password,10)
        const newWorkerOBJ  = {...worker, password: hashedPassword}
       
        const createdWorker = await this.authRepository.createWorker(newWorkerOBJ);
       
        if (!createdWorker.id) {
            throw new Error("Failed to create worker");
          }

        const role = 'Worker'
        const Token = jwtService.generateToken(createdWorker.id,role)
       
        return { createdWorker,Token };

      
    }
    
    
    async login(user:LoginUser) {
        const foundUser = await this.authRepository.findUserByEmail(user.email);
        const foundWorker = foundUser ? null : await this.authRepository.findWorkerByEmail(user.email);
    
        if (!foundUser && !foundWorker) {
            throw new Error("Email doesn't exist");
        }
    
        const account = foundUser || foundWorker;
        
        

        if (!account || !account.id || !account.username || !account.email || !account.password) {
            throw new Error("Invalid account data");
        }
        
    
        const isPasswordCorrect = await bcrypt.compare(user.password, account.password);
        if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
        }
    
        const role = foundUser ? "User" : "Worker";
        const Token = jwtService.generateToken(account.id, role);
    
        return {
            username: account.username,
            email: account.email,
            role,
            Token,
        };
    }
    
}