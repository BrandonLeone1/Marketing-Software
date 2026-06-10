import {z} from 'zod';


export const metricsSchema = z.object({
    clicks: z.coerce.number().nonnegative(),
    impressions: z.coerce.number().nonnegative(),
    conversions: z.coerce.number().nonnegative(),
    ad_spend: z.coerce.number().nonnegative(),
    revenue: z.coerce.number().nonnegative(),
    platform: z.string()
})