import {z} from 'zod';


export const campaigns_create = z.object({
    campaign_name: z.string(),
    budget: z.coerce.number().nonnegative()
})