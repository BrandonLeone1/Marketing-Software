import {z} from 'zod'


export const creative_upload = z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.coerce.number()
})