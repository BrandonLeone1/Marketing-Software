import type { Request, Response } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userid?: string | undefined;
    }
  }
};


export const verifyToken = async (req: Request, res:Response, next: Function) => {

    try {
       
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({success: false, message: "Couldn't retreive token"});
        }

        const isVerified = jwt.verify(token, process.env.JWT_SECRET!) as {userid: string};

        if (!isVerified) {
          return res.status(400).json({success: false, message: "Couldn't retreive token"});
        }

        req.userid = isVerified.userid;
        next();

    } catch (error) {
        console.error(error);
        return res.status(401).json({success: false, message: "Invalid or expired token"});
    };
    

};