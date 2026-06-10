import {z} from 'zod'


export const creative_save = z.object({
    uniqueKey: z.string(),
    creativeType: z.string()
})