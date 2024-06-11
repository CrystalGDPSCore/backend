import { z } from "zod";

const createCommentSchema = z.object({
    userId: z.number().int(),
    itemId: z.number().int(),
    comment: z.string(),
    percent: z.number().int().nullable(),
    isList: z.boolean()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

const getCommentsSchema = z.object({
    itemId: z.number().int(),
    isList: z.boolean(),
    mode: z.enum(["Recent", "Likes"]),
    offset: z.number().int(),
    count: z.number().int()
});

export type GetCommentsInput = z.infer<typeof getCommentsSchema>;

const getUserCommentHistorySchema = z.object({
    userId: z.number().int(),
    mode: z.enum(["Recent", "Likes"]),
    offset: z.number().int(),
    count: z.number().int()
});

export type GetUserCommentHistoryInput = z.infer<typeof getUserCommentHistorySchema>;