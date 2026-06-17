import express from 'express';
import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { userSchema } from '../../zodSchemas/userSchema.js';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';
import { generateAndSendToken } from '../generateAndSendToken.js';
import { verifyToken } from '../verifyToken.js';
import { checkAuth } from '../checkAuth.js';

const router = express.Router();


const authLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 3,
    message: "Too many requests. Please wait to try again.",
    standardHeaders: 'draft-8',
    legacyHeaders: false
});



router.post("/add", authLimit, async (req: Request, res: Response) => {
    try {
    
            const result = userSchema.safeParse(req.body);
            
            if (!result.success) {
            throw new Error (`Invalid or malicious input for email or password`)
            }
    
            const {email, password} = result.data;
    
            const userExists = await pool.query(`
                SELECT *
                FROM users
                WHERE email = $1
            `, [email]);
            
            if (userExists.rows.length > 0) {
                return res.status(400).json({sucess: false, message: "Invalid email or password"});
            };
    
            const hashedPassword = await bcrypt.hash(password, 13);
    
            const newUser = await pool.query(`
                INSERT INTO users (email, password_hashed)
                VALUES ($1, $2)
                RETURNING *    
            `, [email, hashedPassword]);

            await pool.query(`
                INSERT INTO memberships (campaign_id, user_id, user_role)
                VALUES ($1, $2, $3)    
            `, [2, newUser.rows[0].id, 'Member'])
    
            generateAndSendToken(newUser.rows[0].id, req, res);
    
            } catch (error) {
                console.error(error)
                return res.status(500).json({sucess: false, message: "Failed to add user due to server failure"});
            }
})

router.post("/login", authLimit, async (req: Request, res: Response) => {
     try {
    
            const result = userSchema.safeParse(req.body);
    
            if (!result.success) {
                throw new Error ('Failed to validate user input. Malicious or invalid input received')
            }
    
            const {email, password} = result.data;
           
            const userExists = await pool.query(`
                SELECT *
                FROM users
                WHERE email = $1    
            `, [email]);
    
            if (userExists.rows.length < 1) {
                return res.status(400).json({success: false, message: "Invalid email or password"});
            }
    
            const isPasswordTheSame = await bcrypt.compare(password, userExists.rows[0].password_hashed);
    
            if (!isPasswordTheSame) {
                return res.status(400).json({success: false, message: "Invalid email or password"});
            }
    
            generateAndSendToken(userExists.rows[0].id, req, res);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Server error trying to login"});
        }
});

router.get("/check", verifyToken, checkAuth);


export default router;