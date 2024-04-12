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

export const getGJMessagesSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    page: z.coerce.number().int(),
    getSent: z.coerce.boolean().catch(false),
    secret: z.string()
});

export type GetGJMessagesInput = z.infer<typeof getGJMessagesSchema>;