import {z} from 'zod'


const csvMetricsSchema = z.object({
    campaign_id: z.string().or(z.number()),
    metric_date: z.string(),
    platform: z.literal('Google Ads'),
    ad_spend: z.number().nonnegative(),
    revenue: z.number().nonnegative(),
    clicks: z.number().nonnegative(),
    impressions: z.number().nonnegative(),
    conversions: z.number().nonnegative()
})

export const metricsUploadSchema = z.object({
    metricsArray: z.array(csvMetricsSchema).min(1)
})