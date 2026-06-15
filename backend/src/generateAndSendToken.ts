import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userid?: string | undefined;
    }
  }
};

export const generateAndSendToken = (userid: string, req: Request, res: Response) => {
    
    const token = jwt.sign({userid}, process.env.JWT_SECRET!, {
      expiresIn: "3d"
    })
  
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000
    })
    return res.status(200).json({success: true, message: "Sent cookie"})
};