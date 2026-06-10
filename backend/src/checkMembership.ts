import type { Request, Response } from "express";
import { pool } from "./db.js";


export async function checkMembership (req: Request, res: Response, next: Function) {

    try {
        const {id} = req.params;

    if (!id) {
        throw new Error ("Didn't receive an ID")
    }

    const isMember = await pool.query(`
        SELECT *
        FROM memberships    
        WHERE user_id = $1 AND campaign_id = $2
    `, [req.userid, id]);

    if (isMember.rows.length < 1) {
        throw new Error ("User is not a member of this campaign")
    }

    next();

    } catch (error) {
        console.error(error);
        return res.status(403).json({success: false, message: "User is not a member of this campaign"})
    }
    

}