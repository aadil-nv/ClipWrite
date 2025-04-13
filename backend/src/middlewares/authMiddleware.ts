import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../utils/enums";

interface UserPayload {
  id: string;
  email: string;
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as UserPayload;
    
    if (!decoded) {
      
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Next is calling =======>",error);
    
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized" }); 
  }
};

