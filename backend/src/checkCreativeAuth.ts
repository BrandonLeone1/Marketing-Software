import { pool } from "./db.js";
import type { NextFunction, Request, Response } from "express";
const isMemberOfCreative = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {id} = req.params;

    const memberOrNot = await pool.query(`
        SELECT memberships.campaign_id, memberships.user_id
        FROM memberships
        JOIN campaign_creatives
        ON campaign_creatives.campaign_id = memberships.campaign_id
        WHERE campaign_creatives.id = $1 AND memberships.user_id = $2  
        
    `, [id, req.userid]);

    if (memberOrNot.rows.length < 1) {
        return res.status(403).json({success: false, message: "No permission to access the campaign this creative belongs to"})
    };

    next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Failed to check authorization between campaign creative and campaign due to server failure"})
    }
    
}

export default isMemberOfCreative