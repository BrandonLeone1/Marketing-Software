import type { Request, Response } from "express"
import { pool } from "./db.js";

export const checkAuth = async (req: Request, res: Response) => {
    try {
        const user = await pool.query(`
        SELECT id, email
        FROM users
        WHERE id = $1    
        `, [req.userid]);
        
        if (!user.rows[0]) {
            return res.status(400).json({success: false, message: "No user found"});
        }

        res.status(200).json({success: true, user: user.rows[0]});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Server failure trying to get user"})
    }
}