import jwtService from "../../infrastructure/services/jwtService";
import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
    user?: any;
}

interface DecodedToken {
    role: string;
    userId: string;
}

export const authenticateJWT = (allowedRoles:string[])=>{
    
    return  (req: AuthRequest, res: Response, next: NextFunction):void => {
        
        const token = req.header("Authorization")?.split(" ")[1];
      
        
        
        if (!token) {
             res.status(401).json({ message: "Access denied. No token provided." });
            return 
        }
        
    
        try {
            const decoded =   jwtService.verifyToken(token) as DecodedToken;
           
           
            if (!decoded || !allowedRoles.includes(decoded.role)) {
                
                 res.status(403).json({ message: "Access denied. You do not have permission to perform this action" });
                 return
              }
              

            req.user = decoded;
            
            next();
           
    
        } catch (error) {
            console.error(error)
             res.status(403).json({ message: "Invalid token." });
             return
        }
    }


}
