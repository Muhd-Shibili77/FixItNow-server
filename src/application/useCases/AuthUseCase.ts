import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { IAuthRepository } from "../Interfaces/IAuthinterfaces";
import jwtService from "../../infrastructure/services/jwtService";
import User from "../../domain/entity/User";
import Worker from "../../domain/entity/Worker";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECERT,"postmessage");

interface LoginUser {
  email: string;
  password: string;
}

export class AuthUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async sentOTP(newUser: Pick<User, "email">): Promise<{ otp: string }> {
    const { email } = newUser;

    const foundUser = await this.authRepository.findUserByEmail(email);
    const foundWorker = await this.authRepository.findWorkerByEmail(email);
    const isExist = foundUser || foundWorker;

    if (isExist) {
      throw new Error("Email already exist");
    }

    const otp = await this.authRepository.generateOtp(email);
    return { otp };
  }

  async ReSentOTP(newUser: Pick<User, "email">): Promise<{ otp: string }> {
    const { email } = newUser;

    const foundUser = await this.authRepository.findUserByEmail(email);
    const foundWorker = await this.authRepository.findWorkerByEmail(email);
    const isExist = foundUser || foundWorker;

    if (isExist) {
      throw new Error("Email already exist");
    }

    const otp = await this.authRepository.generateOtp(email);
    return { otp };
  }

  async forgetSentOTP(newUser: Pick<User, "email">): Promise<{ otp: string }> {
    const { email } = newUser;

    const foundUser = await this.authRepository.findUserByEmail(email);
    const foundWorker = await this.authRepository.findWorkerByEmail(email);
    if(!foundUser && !foundWorker){
      throw new Error("Email does'nt exist")
    }

    const otp = await this.authRepository.generateOtp(email);
    return { otp };
  }

  async forgetReSentOTP(newUser: Pick<User, "email">): Promise<{ otp: string }> {
    const { email } = newUser;

    const foundUser = await this.authRepository.findUserByEmail(email);
    const foundWorker = await this.authRepository.findWorkerByEmail(email);
    if(!foundUser && !foundWorker){
      throw new Error("Email does'nt exist")
    }

    const otp = await this.authRepository.generateOtp(email);
    return { otp };
  }

  async verifyOTP(otp: {
    email: string;
    otp: string;
  }): Promise<{ success: boolean; message: string }> {
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

  async register(newUser: User): Promise<{ createdUser: User; Token: string,refreshToken:string }> {
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

    const foundUser = await this.authRepository.findUserByEmail(email);
    const foundWorker = await this.authRepository.findWorkerByEmail(email);

    if (foundUser || foundWorker) {
      throw new Error("email already exist");
    }

    // Validation: Password and Confirm Password match
    if (password !== conformpassword) {
      throw new Error("Passwords do not match");
    }

    // Validation: Password strength (min 6 characters)
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const newUserObj = { ...newUser, password: hashedPassword };

    const createdUser = await this.authRepository.create(newUserObj);

    if (!createdUser.id) {
      throw new Error("Failed to create user");
    }

    const role = "User";
    const Token = jwtService.generateToken(createdUser.id, role);
    const refreshToken = jwtService.generateRefreshToken(createdUser.id,role)

    return { createdUser, Token,refreshToken };
  }

  async WorkerRegister(
    worker: Worker
  ): Promise<{ createdWorker: Worker; Token: string,refreshToken:string }> {
    const {
     
      service,
      experience,
      phone,
      about,
      username,
      email,
      password,
      conformpassword,
      profileImage,
    } = worker;

    if (
      !service ||
      !experience ||
      !phone ||
      !about ||
      !username ||
      !email ||
      !password ||
      !conformpassword ||
      !profileImage
    ) {
      throw new Error("All fields are required");
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

    const foundUser = await this.authRepository.findUserByEmail(email);
    const foundWorker = await this.authRepository.findWorkerByEmail(email);

    if (foundUser || foundWorker) {
      throw new Error("email already exist");
    }

    if (password !== conformpassword) {
      throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWorkerOBJ = { ...worker, password: hashedPassword };

    const createdWorker = await this.authRepository.createWorker(newWorkerOBJ);

    if (!createdWorker.id) {
      throw new Error("Failed to create worker");
    }

    const role = "Worker";
    const Token = jwtService.generateToken(createdWorker.id, role);
    const refreshToken = jwtService.generateRefreshToken(createdWorker.id,role)


    return { createdWorker, Token, refreshToken };
  }

  async login(user: LoginUser) {

    const foundUser = await this.authRepository.findUserByEmail(user.email);
    const foundWorker = foundUser
      ? null
      : await this.authRepository.findWorkerByEmail(user.email);

    if (!foundUser && !foundWorker) {
      throw new Error("Email doesn't exist");
    }

    const account = foundUser || foundWorker;

    if (
      !account ||
      !account.id ||
      !account.username ||
      !account.email ||
      !account.password
    ) {
      throw new Error("Invalid account data");
    }
  
    if(account.isBlock){
      throw new Error("user is blocked");
    }

    const isPasswordCorrect = await bcrypt.compare(
      user.password,
      account.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    const role = foundUser ? "User" : "Worker";
    const Token = jwtService.generateToken(account.id, role);
    const refreshToken = jwtService.generateRefreshToken(account.id,role)

    return {
      username: account.username,
      email: account.email,
      role,
      Token,
      refreshToken,
    };
  }


  async googleLogin(response: string) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      

      const { tokens } = await client.getToken(response);
      const { id_token } = tokens;

      if(!id_token){
        throw new Error("id token is not defined")
      }

      if (!clientId) {
        throw new Error("Google Client ID is not defined");
      }

      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience:clientId,
      });
      
      const payload = ticket.getPayload();

      if (!ticket) {
        throw new Error("Token verification failed");
     }
     if (!payload) {
        throw new Error("Invalid token payload");
     }

    if (!payload?.email) throw new Error("Invalid Google token");

    // Check existing users
    let user = await this.authRepository.findUserByEmail(payload.email);
    let worker = await this.authRepository.findWorkerByEmail(payload.email);
    const account = user || worker;

      if(!account || !account.id){
        return { 
            needsUserSelection: true,
            email: payload.email,
            name: payload.name || payload.email.split('@')[0]
          };
      }
 

    const role = worker ? "Worker" : "User";
    const Token = jwtService.generateToken(account?.id, role);
    const refreshToken = jwtService.generateRefreshToken(account?.id,role)
    return {
      email: payload.email,
      role,
      Token,
      refreshToken,
    };

    } catch (error) {
      console.error("Google Login Error:", error);
      throw new Error("Authentication failed");
    }

    
   
   
    
  }

  async googleCreateUser(username:string,email:string){
    
    
    if(!username || !email){
      throw new Error("All field are required")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const createdUser = await this.authRepository.createGoogleUser(username,email);

    if (!createdUser.id) {
      throw new Error("Failed to create user");
    }

    const role = "User";
    const Token = jwtService.generateToken(createdUser.id, role);
    const refreshToken = jwtService.generateRefreshToken(createdUser.id,role)
    return { createdUser, Token,refreshToken };

  }
  async googleCreateWorker(username:string,email:string,service:string,experience:number,phone:number,about:string,profileImage:string){
  

    if (
      
      !service ||
      !experience ||
      !phone ||
      !about ||
      !username ||
      !email ||
      !profileImage
    ) {
      throw new Error("All fields are required");
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

   

    const createdWorker = await this.authRepository.createGoogleWorker(username,email,service,experience,phone,about,profileImage);

    if (!createdWorker.id) {
      throw new Error("Failed to create worker");
    }

    const role = "Worker";
    const Token = jwtService.generateToken(createdWorker.id, role);
    const refreshToken = jwtService.generateRefreshToken(createdWorker.id,role)
    return { createdWorker, Token,refreshToken };
  }

  async newAccessToken(refreshToken:string){
    const decoded =  jwtService.verifyRefreshToken(refreshToken)
    const newAccessToken = jwtService.generateToken(decoded.userId,decoded.role)
    return newAccessToken
  }

  async changePassword(newPassword:string,confirmPassword:string,email:string){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
      }

      const foundUser = await this.authRepository.findUserByEmail(email);
      const foundWorker = await this.authRepository.findWorkerByEmail(email);
     
      const account = foundUser || foundWorker
      if(!account){
        throw new Error("email doesnt exist");
      }
      let role;
      let id;
      if(foundUser){
        role="User"
        id = foundUser.id
      }else if(foundWorker){
        role="Worker"
        id = foundWorker.id
      }
      if(!role || !id){
        throw new Error('role & id not found')
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await this.authRepository.changePassword(hashedPassword,role,id)
      return
  } 
  
}
