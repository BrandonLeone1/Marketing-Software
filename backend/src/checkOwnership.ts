import { pool } from "./db.js";
import type { Request, Response } from "express";

export async function checkOwnership (req: Request, res: Response, next: Function) {

    try {
        const {id} = req.params;

    if (!id) {
        throw new Error (`Didn't receive an ID`)
    }

    const isOwner = await pool.query(`
        SELECT *
        FROM memberships
        WHERE user_id = $1 AND user_role = $2 AND campaign_id = $3
    `, [req.userid, 'Owner', id])

    if (isOwner.rows.length < 1) {
        throw new Error ('Failed to membership with owner status for this user')
    }

    next();

    } catch (error) {
        console.error(error);
        return res.status(403).json({success: false, message: "User is not an owner of this campaign"})
    }

    

}