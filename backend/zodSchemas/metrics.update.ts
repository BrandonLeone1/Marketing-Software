import {z} from 'zod'


export const metrics_update = z.object({
    campaign_id: z.number().nonnegative().or(z.string()),
    clicks: z.coerce.number().nonnegative(),
    impressions: z.coerce.number().nonnegative(),
    conversions: z.coerce.number().nonnegative(),
    ad_spend: z.coerce.number().nonnegative(), 
    revenue: z.coerce.number().nonnegative(),
    platform: z.string()
})