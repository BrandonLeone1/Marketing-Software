import express from 'express';
import type { Request, Response } from 'express';
import { verifyToken } from '../verifyToken.js';
import { checkOwnership } from '../checkOwnership.js';
import { pool } from '../db.js';
import { metricsSchema } from '../../zodSchemas/metricsSchema.js';
import { metricsUploadSchema } from '../../zodSchemas/csvMetrics.js';
import format from 'pg-format';
import { checkMembership } from '../checkMembership.js';
import { isOwner } from '../isOwner.auth.js';
import { metrics_update } from '../../zodSchemas/metrics.update.js';
const metricsRouter = express.Router();

metricsRouter.post("/create/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
    try {
    
            const {id} = req.params;
    
            if (!id) {
                return res.status(400).json({success: false, message: "Not given an id"});
            }
    
            const result = metricsSchema.safeParse(req.body);
    
            if (!result.success) {
                throw new Error ('Invalid or malicious input received for metrics.')
            }
    
            const {clicks, impressions, conversions, ad_spend, revenue, platform} = result.data;
    
            const newMetrics = await pool.query(`
                INSERT INTO campaign_metrics (campaign_id, clicks, impressions, conversions, ad_spend, revenue, platform)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *    
            `, [id, clicks, impressions, conversions, ad_spend, revenue, platform]);
    
            if (newMetrics.rows.length < 1) {
                return res.status(500).json({success: false, message: "Failed to add metrics to campaign"});
            };
    
            res.status(200).json({success: true, data: newMetrics.rows[0]});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to create metrics for campaign"});
        }
});

metricsRouter.post("/google-ads/add/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
     const client = await pool.connect();
        
        try {
            
            const {id} = req.params;
            
    
            const validation = metricsUploadSchema.safeParse(req.body);
    
            if (!validation.success) {
                
                return res.status(400).json({success: false, message: "Malicious or invalid data"})
            }
    
            const {metricsArray} = validation.data;
    
             if (!metricsArray || metricsArray.length < 1) {
               
                return res.status(400).json({success: false, message: "Didn't receive a metrics array to save"});
            }
    
            await client.query('BEGIN');
    
            const values = metricsArray.map((row:any) => {
                return [
                    id,
                    row.metric_date,
                    row.platform,
                    row.ad_spend !== null ? row.ad_spend : 0,
                    row.revenue !== null ? row.revenue : 0,
                    row.clicks !== null ? row.clicks : 0,
                    row.impressions !== null ? row.impressions : 0,
                    row.conversions !== null ? row.conversions : 0
                ]
            });
    
            const bulkQuery = format(`
                INSERT INTO campaign_metrics(campaign_id, metric_date, platform, ad_spend, revenue, clicks, impressions, conversions)
                VALUES %L
                ON CONFLICT (campaign_id, metric_date, platform)
                DO UPDATE SET
                    ad_spend = EXCLUDED.ad_spend,
                    revenue = EXCLUDED.revenue,
                    clicks = EXCLUDED.clicks,
                    impressions = EXCLUDED.impressions,
                    conversions = EXCLUDED.conversions
            `, values);
            
    
            await client.query(bulkQuery);
    
            await client.query('COMMIT');
           
            return res.status(200).json({success: true, message: "Uploaded metrics successfully"})
    
        } catch (error) {
            await client.query('ROLLBACK');
            console.error(error);
            res.status(500).json({success: false, message: "Failed to upload metrics due to server error"})
        } finally {
            client.release()
        }
});

metricsRouter.get("/get/:id", verifyToken, checkMembership, async (req: Request, res: Response) => {
    try {
    
            const {id} = req.params;
    
            if (!id) {
                return res.status(400).json({success: false, message: "Didn't receive an ID for campaign"});
            }
    
            const metricsForCampaign = await pool.query(`
                SELECT *
                FROM campaign_metrics
                WHERE campaign_id = $1    
            `, [id]);
    
            res.status(200).json({success: true, data: metricsForCampaign.rows});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Couldn't get metrics for campaign due to server error"});
        }
});

metricsRouter.put("/update/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
    
            const result = metrics_update.safeParse(req.body);
    
            if (!result.success || !id) {
                throw new Error ('Malicious or invalid input detected')
            }
    
            const {clicks, impressions, conversions, ad_spend, revenue, platform} = result.data
            
            const campaignLinkedToMetric = await pool.query(`
                SELECT campaign_id
                FROM campaign_metrics
                WHERE id = $1    
            `, [id])
    
            if (campaignLinkedToMetric.rows.length < 1) {
                return res.status(400).json({success: false, message: "No metric exists with this ID"})
            }
    
            const isUserOwner = await isOwner(req.userid, campaignLinkedToMetric.rows[0].campaign_id);
    
            if (!isUserOwner) {
                return res.status(403).json({success: false, message: "Forbidden"})
            }
    
            const updatedMetrics = await pool.query(`
            UPDATE campaign_metrics
            SET clicks = $1, impressions = $2, conversions = $3, ad_spend = $4, revenue = $5, platform = $6
            WHERE id = $7
            RETURNING *    
            `, [clicks, impressions, conversions, ad_spend, revenue, platform, id]);
    
            res.status(200).json({success: true, data: updatedMetrics.rows[0]});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Couldn't update metrics for campaign due to server error"});
        }
})

export default metricsRouter