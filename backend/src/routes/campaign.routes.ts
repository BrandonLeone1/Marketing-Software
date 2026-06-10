import express from 'express';
import type { Request, Response } from 'express';
import { verifyToken } from '../verifyToken.js';
import { pool } from '../db.js';
import { campaigns_create } from '../../zodSchemas/campaigns.create.js';
import { checkOwnership } from '../checkOwnership.js';
import { campaigns_update } from '../../zodSchemas/campaigns.update.js';
import { addMember } from '../../zodSchemas/addMember.js';
import { S3Client } from '@aws-sdk/client-s3';
import { checkMembership } from '../checkMembership.js';
import rateLimit from 'express-rate-limit';
import { creative_upload } from '../../zodSchemas/creative.upload.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { creative_save } from '../../zodSchemas/creative.save.js';
import isMemberOfCreative from '../checkCreativeAuth.js';
import OpenAI from 'openai';

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_USER_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});


const awsLimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    message: "Uploading too many files. Please slow down and wait.",
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

const openAILimit = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    message: "Sending too many requests for insights. Please slow down and wait.",
    standardHeaders: 'draft-8',
    legacyHeaders: false
});


const campaignRouter = express.Router();

campaignRouter.post("/create", verifyToken, async (req: Request, res: Response) => {
    const client = await pool.connect();
        try {
            
            const result = campaigns_create.safeParse(req.body);
    
            if (!result.success) {
                throw new Error('Malicious or invalid input detected.')
            }
    
            const {campaign_name, budget} = result.data
            
            
            await client.query('BEGIN')
    
            const newCampaign = await client.query(`
                INSERT INTO campaigns (campaign_name, budget)
                VALUES ($1, $2)
                RETURNING *    
            `, [campaign_name, budget]);
    
            if (newCampaign.rows.length < 1) {
                await client.query('ROLLBACK')
                return res.status(500).json({success: false, message: "Failed to create campaign"});
            };
    
            const newMembership = await client.query(`
                INSERT INTO memberships (campaign_id, user_id, user_role)
                VALUES ($1, $2, $3)
                RETURNING *
            `, [newCampaign.rows[0].id, req.userid, 'Owner']);
    
            if (newMembership.rows.length < 1) {
                await client.query('ROLLBACK')
                return res.status(500).json({success: false, message: "Failed to create membership"});
            };
    
            await client.query('COMMIT')
            res.status(200).json({success: true, newCampaign: newCampaign.rows[0], newMembership: newMembership.rows[0]});
    
        } catch (error) {
            await client.query('ROLLBACK')
            console.error(error);
            return res.status(500).json({success: false, message: "Server failure when adding campaign"});
        } finally {
            client.release();
        }
});

campaignRouter.get("/get", verifyToken, async (req: Request, res: Response) => {
     try {
            
            const usersCampaigns = await pool.query(`
            SELECT campaigns.id, campaigns.campaign_name, campaigns.created_at, campaigns.status, campaigns.budget, memberships.user_role
            FROM campaigns
            JOIN memberships
            ON campaigns.id = memberships.campaign_id
            WHERE memberships.user_id = $1
            `, [req.userid]);
    
            return res.status(200).json({success: true, data: usersCampaigns.rows});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to get users campaigns"});
        };
})

campaignRouter.put("/update/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
    
            const result = campaigns_update.safeParse(req.body);
    
            if (!result.success || !id) {
                throw new Error ('Failed invalid or malicious data detected')
            }
    
           const {campaign_name, status, budget} = result.data;
    
    
            const updatedCampaign = await pool.query(`
                UPDATE campaigns
                SET campaign_name = $1, status = $2, budget = $3
                WHERE id = $4
                RETURNING *    
            `, [campaign_name, status, budget, id]);
    
            if (updatedCampaign.rows.length < 1) {
                return res.status(400).json(({success: false, message: "Failed to upate campaign, likely bad values"}));
            };
    
            res.status(200).json({success: true, data: updatedCampaign.rows[0]});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to update campaigns"});
        };
});

campaignRouter.delete("/delete/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
    try {
    
            const {id} = req.params;
    
            if (!id) {
                return res.status(400).json({success: false, message: "Didn't receive an ID"});
            }
    
            const deletedCampaign = await pool.query(`
            DELETE FROM campaigns
            WHERE id = $1
            RETURNING *
            `, [id]);
    
            if (deletedCampaign.rows.length < 1) {
                return res.status(400).json({success: false, message: "Couldn't find campaign to delete"});
            };
    
            res.status(200).json({success: true, data: deletedCampaign.rows[0]});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to delete campaign due to server error"});
        }
});

campaignRouter.post("/add-member/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
     try {
    
            const {id} = req.params;
            const result = addMember.safeParse(req.body);
    
            if (!result.success || !id) {
                throw new Error('Invalid or malicious input detected')
            }
    
            const {email} = result.data;
    
            const givenUser = await pool.query(`
            SELECT id
            FROM users
            WHERE email = $1    
            `, [email]);
    
            if (givenUser.rows.length < 1) {
                return res.status(400).json({success: false, message: "Couldn't find a user for the given email"});
            };
    
            const newMembership = await pool.query(`
            INSERT INTO memberships (campaign_id, user_id, user_role)
            VALUES ($1, $2, $3)
            RETURNING *
            `, [id, givenUser.rows[0].id, 'Member']);
            
            if (newMembership.rows.length < 1) {
                return res.status(500).json({success: false, message: "Failed to add user to this campaign!"});
            };
    
            res.status(200).json({success: true, data: newMembership.rows[0]});
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Couldn't add user to campaign due to server error"});
        };
});

campaignRouter.get("/get-team/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
    try {
            const {id} = req.params;
    
    
            const allTeamMembers = await pool.query(`
            SELECT users.email, memberships.id AS membersid
            FROM users
            JOIN memberships
            ON users.id = memberships.user_id
            WHERE memberships.campaign_id = $1 AND memberships.user_role != 'Owner'
            `, [id]);
    
            res.status(200).json({success: true, data: allTeamMembers.rows});
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to get team members due to server failure"})
        }
})

campaignRouter.post("/remove-member/:id", verifyToken, checkOwnership, async (req: Request, res: Response) => {
     try {
            const {id} = req.params;
            let {membersid} = req.body;
            membersid = Number(membersid)
            console.log(id, membersid)
    
    
            const removedMember = await pool.query(`
                DELETE FROM memberships
                WHERE id = $1 AND campaign_id = $2 AND user_role = $3
                RETURNING *    
            `, [membersid, id, 'Member']);
    
            res.status(200).json({success: true, data: removedMember.rows})
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to remove member from campaign due to server failure"})
        }
});

campaignRouter.post("/creative-work/upload/:id", awsLimit, verifyToken, checkMembership, async (req: Request, res: Response) => {
     try {
    
            const {id} = req.params;
            const result = creative_upload.safeParse(req.body);
            if (!result.success) {
                throw new Error('Invalid or malicious input')
            }
    
    
            const {fileName, fileType, fileSize} = result.data;
    
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    
            if (!allowedTypes.includes(String(fileType))) {
                return res.status(400).json({success: false, message: "Please upload a jpeg, png, or webp file only."})
            }
    
            
            const maxFileSize = 2 * 1024 * 1024;
            const parsedFileSize = Number(fileSize);
    
            if (!parsedFileSize || isNaN(parsedFileSize) || parsedFileSize > maxFileSize) {
                return res.status(400).json({success: false, message: "Failed, file size is too big"})
            }
    
            const safeFileName = fileName.replace(/[^0-9a-z]/gi, "");
            const uniqueKey = `ab-creative-tests/${Date.now()}-${safeFileName}`;
    
            const s3Command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME!,
                Key: uniqueKey,
                ContentType: fileType,
               
            })
    
            const uploadURL = await getSignedUrl(s3, s3Command, {expiresIn: 300});
    
            res.status(200).json({uploadURL, uniqueKey})
    
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to upload creative piece due to a server error."})
        }
});

campaignRouter.post("/save-creative/:id", verifyToken, checkMembership, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
    
            const result = creative_save.safeParse(req.body);
    
            if (!result.success) {
                throw new Error('Invalid or malicious input')
            }
    
            const {uniqueKey, creativeType} = result.data
           
    
            const savedCreative = await pool.query(`
            INSERT INTO campaign_creatives (campaign_id, aws_link, creative_type)  
            VALUES ($1, $2, $3)
            RETURNING *  
            `, [id, uniqueKey, creativeType]);
    
            res.status(200).json({data: savedCreative.rows})
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to save creative to postgresDB"})
        }
});

campaignRouter.get("/get-creatives/:id", verifyToken, checkMembership, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
    
    
            const creatives = await pool.query(`
                SELECT *
                FROM campaign_creatives
                WHERE campaign_id = $1
            `, [id]);
    
            const workingURLS = await Promise.all(
                creatives.rows.map(async (row) => {
                    const command = new GetObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME!,
                        Key: row.aws_link
                    });
                    const signedURL = await getSignedUrl(s3, command, {expiresIn: 3600})
                    
                    return {
                        id: row.id,
                        campaign_id: row.campaign_id,
                        aws_link: signedURL,
                        creative_type: row.creative_type,
                        votes: row.votes,
                        uploaded_at: row.uploaded_at
                    }
                })
            )
    
            res.status(200).json({success: true, data: workingURLS})
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to get creatives for this campaign"})
        }
});

campaignRouter.put("/creatives/vote/:id", verifyToken, isMemberOfCreative, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
    
            const newVote = await pool.query(`
                UPDATE campaign_creatives
                SET votes = votes + 1
                WHERE id = $1
                RETURNING *    
            `, [id])
    
            res.status(200).json({success: true, data: newVote.rows[0]})
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to add a vote to the creative due to server error"})
        }
});

campaignRouter.delete("/creatives/delete/:id", verifyToken, isMemberOfCreative, async (req: Request, res: Response) => {
    try {
            
            const {id} = req.params;
           
            const deletedCreative = await pool.query(`
            DELETE FROM campaign_creatives
            WHERE id = $1    
            RETURNING *    
            `,[id]);
    
            res.status(200).json({success: true, data: deletedCreative.rows[0]})
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({success: false, message: "Failed to delete campaign creative"})
        }
})

campaignRouter.get("/insights/:id", openAILimit, verifyToken, checkMembership, async (req: Request, res: Response) => {
     try {
        
        const {id} = req.params;


        const dbResult = await pool.query(`
            SELECT platform, SUM(ad_spend) AS spend, SUM(clicks) AS clicks, SUM(impressions) AS impressions, SUM(revenue) AS revenue, SUM(conversions) AS conversions, SUM(revenue)::NUMERIC / NULLIF(SUM (ad_spend), 0) AS roas, (SUM(clicks)::NUMERIC / NULLIF(SUM(impressions), 0)) * 100 AS ctr
            FROM campaign_metrics
            WHERE campaign_id = $1 AND metric_date >= CURRENT_DATE - INTERVAL '14 days'
            GROUP BY platform
        `, [id]);

        if (dbResult.rows.length < 1) {
            return res.status(500).json({success: false, message: "Failed to get info, not enough info"})
        }

        
       
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
            {
                role: "system",
                content: `You are a Senior MarOps Growth Consultant providing a high-signal C-Suite summary of 14-day performance data. All metrics are pre-calculated; do not attempt math—interpret trends.
                
                CRITICAL CONDITION:
            - If the dataset contains ONLY ONE platform, omit the "### THE LEAK" section completely. Move directly from "THE WIN" to "THE PLAY".

            STRUCTURE REQUIREMENTS:

            ### THE WIN
            Identify the top-performing platform. State its exact platform name, **conversions**, and **ROAS** (or **CTR** if revenue is 0). Explicitly state if it is winning due to volume or efficiency.

            ### THE LEAK
            (Omit if only one platform exists). Identify the weakest platform. State its exact **spend** and diagnose the operational failure point (e.g., high spend with zero conversions, or low **CTR** indicating creative fatigue).

            ### THE PLAY
            Provide exactly one tactical execution step for tomorrow.
            - Include a **Confidence Score (0-100%)**.
            - Include a **Risk Warning** (e.g., caution against scaling campaigns with < 5 conversions due to low statistical significance).

            FORMATTING & STYLE:
            - Use exact Markdown headers as shown above.
            - **Bold** all numerical metrics and platform names.
            - Tone: Executive, direct, and ruthlessly efficiency-driven.
                
                `
            },
            {
                role: "user",
                content: `Analyze this dataset: ${JSON.stringify(dbResult.rows)}`
            }
            ],
            temperature: 0.2,
            max_completion_tokens: 220
        });
     

        res.status(200).json({success: true, data: aiResponse.choices[0]?.message.content})

    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Failed to get insights for the campaign"})
    }
})


export default campaignRouter;