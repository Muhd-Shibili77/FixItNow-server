import { Request, Response } from "express";
import { AuthUseCase } from "../../application/useCases/AuthUseCase";

export class AuthController {
  constructor(private AuthUseCase: AuthUseCase) {}

  async sentOTP(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.body.email;
      const response = await this.AuthUseCase.sentOTP({ email });
      res.json({ success: true, message: "otp sented successfully", response });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async resentOTP(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.body.email;

      const response = await this.AuthUseCase.ReSentOTP({ email });
      res.json({
        success: true,
        message: "otp re-sented successfully",
        response,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async forgetSentOTP(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.body.email;
      const response = await this.AuthUseCase.forgetSentOTP({ email });
      res.json({ success: true, message: "otp sented successfully", response });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }
  async forgetResentOTP(req: Request, res: Response): Promise<void> {
    try {
      const email: string = req.body.email;

      const response = await this.AuthUseCase.forgetReSentOTP({ email });
      res.json({
        success: true,
        message: "otp re-sented successfully",
        response,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      await this.AuthUseCase.verifyOTP({ email: email, otp: otp });
      res.json({ success: true, message: "otp verified successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, conformpassword } = req.body;
      const response = await this.AuthUseCase.register({
        username,
        email,
        password,
        conformpassword,
      });

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "User registered successfully",
        response,
        Token: response.Token,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async createWorker(req: Request, res: Response): Promise<void> {
    try {
      const {
        service,
        experience,
        phone,
        about,
        username,
        email,
        password,
        conformpassword,
        image,
      } = req.body;

      const response = await this.AuthUseCase.WorkerRegister({
        username,
        email,
        password,
        conformpassword,
        service,
        experience,
        phone,
        about,
        profileImage: image,
      });

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "worker registered successfully",
        response,
        Token: response.Token,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async loginUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const response = await this.AuthUseCase.login({ email, password });

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        response,
        Token: response.Token,
      });
    } catch (error: any) {
      console.error("Login Error:", error);
      const statusCode =
        error.message === "Email doesn't exist" ||
        error.message === "Incorrect password"
          ? 401
          : 500;

      return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async googleAuth(req: Request, res: Response): Promise<Response> {
    try {
      const { credential } = req.body;
      const response = await this.AuthUseCase.googleLogin(credential);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Google login successful",
        ...response,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async googleCreateUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;

      const response = await this.AuthUseCase.googleCreateUser(username, email);

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "User registered with google successfully",
        response,
        Token: response.Token,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async googleCreateWorker(req: Request, res: Response): Promise<void> {
    try {
      const { service, experience, phone, about, username, email, image } =
        req.body;
      const profileImage: string = image;
      const response = await this.AuthUseCase.googleCreateWorker(
        username,
        email,
        service,
        experience,
        phone,
        about,
        profileImage
      );

      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: "worker registered with google successfully",
        response,
        Token: response.Token,
      });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(403)
          .json({ success: false, message: "Refresh token missing" });
      }

      const newAccessToken = await this.AuthUseCase.newAccessToken(
        refreshToken
      );
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }
  }

  async changePassword(req:Request,res:Response){
    try {
     
      const { password: { newPassword, confirmPassword }, email } = req.body;
      
      const response = await this.AuthUseCase.changePassword(
        newPassword,
        confirmPassword,
        email
      )
      return res.status(200).json({
        success: true,
        message:'password has been changed'
      });

    } catch (error) {
      return res
        .status(403)
        .json({ success: false, message: "error in changing password" });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(204).json({ message: "No token found" });
      }
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true, // Ensure this is set in production (HTTPS)
        sameSite: "none",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
