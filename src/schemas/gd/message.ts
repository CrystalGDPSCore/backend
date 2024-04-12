import { z } from "zod";

export const uploadGJMessageSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    toAccountID: z.coerce.number().int(),
    subject: z.string(),
    body: z.string(),
    secret: z.string()
});

export type UploadGJMessageInput = z.infer<typeof uploadGJMessageSchema>;