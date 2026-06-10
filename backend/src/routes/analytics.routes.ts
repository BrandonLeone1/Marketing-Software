import express from 'express';
import type { Request, Response } from 'express';
import { pool } from '../db.js';
import { verifyToken } from '../verifyToken.js';
import { checkMembership } from '../checkMembership.js';


const analyticsRouter = express.Router();

analyticsRouter.get("/summary/:id", verifyToken, checkMembership, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
            const requestedDays = req.query.days ? parseInt(String(req.query.days)) : 30;
            if (!id) {
                return res.status(400).json({success: false, message: "Didn't receive an ID"});
            }
    
            const summaryReqDays = await pool.query(`
            SELECT SUM(clicks) AS clicks, SUM(impressions) AS impressions, SUM(conversions) AS conversions, SUM(ad_spend) AS ad_spend, SUM(revenue) AS revenue, (SUM(revenue)::NUMERIC / NULLIF(SUM(ad_spend), 0)) AS roas, (SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0)) * 100 AS ctr, (SUM(conversions)::NUMERIC / NULLIF(SUM(clicks), 0)) * 100 AS conversion_rate, SUM(ad_spend)::NUMERIC / NULLIF(SUM(conversions), 0) as cpa
            FROM campaign_metrics
            WHERE campaign_id = $1 AND metric_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
            `, [id, requestedDays]);
    
    
            res.status(200).json({success: true, data: summaryReqDays.rows[0]});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Couldn't get analytics summary for the campaign due to server error"});
        };
});

analyticsRouter.get("/trends/:id", verifyToken, checkMembership, async (req: Request, res: Response) => {

        try {
        const {id} = req.params;
        const requestedDays = req.query.days ? parseInt(String(req.query.days)) : 30;
    
        if (!id) {
            return res.status(400).json({success: false, message: "Didn't receive an ID"});
        };
    
        const trends = await pool.query(`
        SELECT metric_date, 
        SUM(ad_spend) AS spend,
        SUM(revenue) AS revenue,
        SUM(clicks) AS clicks,  
        SUM(conversions) AS conversions,
        SUM(revenue)::NUMERIC / NULLIF(SUM(ad_spend), 0) as roas,
        (SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0)) * 100 as ctr
        FROM campaign_metrics
        WHERE campaign_id = $1 AND metric_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
        GROUP BY metric_date
        ORDER BY metric_date ASC
        `, [id, requestedDays]);
        
        res.status(200).json({success: true, data: trends.rows});
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Couldn't get analytics trends for the campaign due to server error"});
        };
});

analyticsRouter.get("/platform-breakdown/:id", verifyToken, checkMembership, async (req: Request, res: Response) => {
    try {
            const {id} = req.params;
            const requestedDays = req.query.days ? parseInt(String(req.query.days)) : 30;
            if (!id) {
                return res.status(400).json({success: false, message: "Didn't receive an ID"});
            };
    
            const platformData = await pool.query(`
                SELECT platform, SUM(clicks) AS clicks, SUM(impressions) AS impressions, SUM(conversions) AS conversions, SUM(ad_spend) AS spend, SUM(revenue) AS revenue, SUM(revenue)::NUMERIC / NULLIF(SUM(ad_spend), 0) as roas, (SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0)) * 100 as ctr, SUM(ad_spend)::NUMERIC / NULLIF(SUM(conversions), 0) as cpa
                FROM campaign_metrics
                WHERE campaign_id = $1 AND metric_date >= CURRENT_DATE - ($2 || ' days')::INTERVAL
                GROUP BY platform
                ORDER BY revenue DESC
            `, [id, requestedDays]);
    
            res.status(200).json({success: true, data: platformData.rows});
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Couldn't get analytics platform data for the campaign due to server error"});
        };
});

analyticsRouter.get("/past-7-spend-per-campaign", verifyToken, async (req: Request, res: Response) => {
    try {
            
            const usersCampaigns = await pool.query(`
            SELECT campaigns.id
            FROM campaigns
            JOIN memberships
            ON campaigns.id = memberships.campaign_id
            WHERE memberships.user_id = $1    
            `, [req.userid]);
    
            const campaignIDS = usersCampaigns.rows.map(campaign => campaign.id);
    
            const spendPerCampaign = await pool.query(`
            SELECT campaign_id, SUM(ad_spend) AS spend, metric_date
            FROM campaign_metrics
            WHERE campaign_id = ANY ($1) AND metric_date >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY campaign_id, metric_date
            ORDER BY metric_date ASC
            `, [campaignIDS])
    
            const rows = spendPerCampaign.rows;
            const spendLineCharts = {} as any;
    
            for (const row of rows) {
                if (!spendLineCharts[row.campaign_id]) {
                    spendLineCharts[row.campaign_id] = [];
                }
    
                spendLineCharts[row.campaign_id].push({
                    spend: parseFloat(row.spend),
                    metric_date: row.metric_date
                })
            }
    
            res.status(200).json({success: true, data: spendLineCharts});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to grab spend per campaign"});
        }
});

analyticsRouter.get("/homepage-overview-7-days", verifyToken, async (req: Request, res: Response) => {
     try {
            
            const usersCampaigns = await pool.query(`
                SELECT campaigns.id
                FROM campaigns
                JOIN memberships
                ON campaigns.id = memberships.campaign_id
                WHERE memberships.user_id = $1     
            `, [req.userid]);
    
            const campaignIDS = usersCampaigns.rows.map(campaign => campaign.id);
    
            const summaryInfo = await pool.query(`
            SELECT SUM(ad_spend) AS spend, (SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0)) * 100 AS ctr, SUM(revenue)::NUMERIC / NULLIF(SUM(ad_spend), 0) AS roas   
            FROM campaign_metrics
            WHERE campaign_id = ANY($1) AND metric_date >= CURRENT_DATE - INTERVAL '7 days'
            `, [campaignIDS])
    
            const summaryInfoLastWeek = await pool.query(`
            SELECT SUM(ad_spend) AS spend, (SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0)) * 100 AS ctr, SUM(revenue)::NUMERIC / NULLIF(SUM(ad_spend), 0) AS roas    
            FROM campaign_metrics
            WHERE campaign_id = ANY($1) AND metric_date >= CURRENT_DATE - INTERVAL '14 days' AND metric_date < CURRENT_DATE - INTERVAL '7 days'
            `, [campaignIDS])
            
            let combinedArray = [summaryInfo.rows[0], summaryInfoLastWeek.rows[0]]
            combinedArray = combinedArray.map((entry,index) => {
                const timePeriod = index === 0 ? "This week" : "Last week"
                return {
                    timePeriod,
                    ...entry,
                }
            })
    
            res.status(200).json({success: true, data: combinedArray});
    
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to get homepage overview"});
        }
})

export default analyticsRouter