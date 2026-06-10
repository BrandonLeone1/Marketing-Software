import { pool } from "./db.js";

export async function isOwner (userid: any, campaignid: any) {
  
    const result = await pool.query(`
    SELECT *
    FROM memberships
    WHERE user_id = $1 AND user_role = $2 AND campaign_id = $3  
    `, [userid, 'Owner', campaignid]);
    

    return result.rows.length > 0;
}