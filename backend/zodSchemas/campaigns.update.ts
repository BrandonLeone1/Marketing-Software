import {z} from 'zod'

export const campaigns_update = z.object({
    campaign_name: z.string(),
    status: z.string(),
    budget: z.coerce.number().nonnegative()
})