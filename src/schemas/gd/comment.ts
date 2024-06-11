import { z } from "zod";

export const uploadGJCommentSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    percent: z.coerce.number().int().catch(0),
    comment: z.string(),
    secret: z.string()
});

export type UploadGJCommentInput = z.infer<typeof uploadGJCommentSchema>;

export const getGJCommentsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    levelID: z.coerce.number().int(),
    page: z.coerce.number().int(),
    mode: z.enum(["0", "1"]).transform(value => {
        switch (value) {
            case "0":
                return "Recent";
            case "1":
                return "Likes";
        }
    }),
    count: z.coerce.number().int().catch(10),
    secret: z.string()
});

export type GetGJCommentsInput = z.infer<typeof getGJCommentsSchema>;

export const deleteGJCommentSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    commentID: z.coerce.number().int(),
    levelID: z.coerce.number().int(),
    secret: z.string()
});

export type DeleteGJCommentInput = z.infer<typeof deleteGJCommentSchema>;

export const getGJCommentHistorySchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    userID: z.coerce.number().int(),
    page: z.coerce.number().int(),
    mode: z.enum(["0", "1"]).transform(value => {
        switch (value) {
            case "0":
                return "Recent";
            case "1":
                return "Likes";
        }
    }),
    count: z.coerce.number().int().catch(10),
    secret: z.string()
});

export type GetGJCommentHistoryInput = z.infer<typeof getGJCommentHistorySchema>;