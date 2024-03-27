import { z } from "zod";

export const uploadGJAccCommentSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    comment: z.string(),
    secret: z.string()
});

export type UploadGJAccCommentInput = z.infer<typeof uploadGJAccCommentSchema>;

export const getGJAccountCommentsSchema = z.object({
    accountID: z.array(z.coerce.number()),
    gjp2: z.string(),
    page: z.coerce.number(),
    secret: z.string()
});

export type GetGJAccountCommentsInput = z.infer<typeof getGJAccountCommentsSchema>;

export const deleteGJAccCommentSchema = z.object({
    accountID: z.coerce.number(),
    gjp2: z.string(),
    commentID: z.coerce.number(),
    secret: z.string()
});

export type DeleteGJAccCommentInput = z.infer<typeof deleteGJAccCommentSchema>;