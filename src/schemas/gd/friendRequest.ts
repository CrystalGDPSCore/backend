import { z } from "zod";

export const uploadFriendRequestSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    toAccountID: z.coerce.number().int(),
    comment: z.string(),
    secret: z.string()
});

export type UploadFriendRequestInput = z.infer<typeof uploadFriendRequestSchema>;

export const getGJFriendRequestsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    page: z.coerce.number().int(),
    getSent: z.coerce.boolean().catch(false),
    secret: z.string()
});

export type GetGJFriendRequestsInput = z.infer<typeof getGJFriendRequestsSchema>;

export const readGJFriendRequestSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    requestID: z.coerce.number().int(),
    secret: z.string()
});

export type ReadGJFriendRequestInput = z.infer<typeof readGJFriendRequestSchema>;

export const acceptGJFriendRequestSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    targetAccountID: z.coerce.number().int(),
    requestID: z.coerce.number().int(),
    secret: z.string()
});

export type AcceptGJFriendRequestInput = z.infer<typeof acceptGJFriendRequestSchema>;

export const deleteGJFriendRequestsSchema = z.object({
    accountID: z.coerce.number().int(),
    gjp2: z.string(),
    targetAccountID: z.coerce.number().int(),
    isSender: z.enum(["0", "1"]).transform(value => value === "1"),
    accounts: z.string().transform(value => value.split(",").map(accountId => parseInt(accountId))).catch([]),
    secret: z.string(),
});

export type DeleteGJFriendRequestsInput = z.infer<typeof deleteGJFriendRequestsSchema>;