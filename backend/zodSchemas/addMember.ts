import {z} from 'zod';


export const addMember = z.object({
    email: z.string()
})