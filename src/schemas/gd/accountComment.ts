import { z } from "zod";

export const uploadGJAccCommentSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    comment: z.string(),
    secret: z.string()
});

export type UploadGJAccCommentInput = z.infer<typeof uploadGJAccCommentSchema>;