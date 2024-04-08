import { z } from "zod";

const createFriendRequestSchema = z.object({
    recipientId: z.number().int(),
    comment: z.string()
});

export type CreateFriendRequestInput = z.infer<typeof createFriendRequestSchema>;

const getFriendRequestsSchema = z.object({
    offset: z.number().int(),
    isSent: z.boolean()
});

export type GetFriendRequestsInput = z.infer<typeof getFriendRequestsSchema>;

const addFriendFromRequestSchema = z.object({
    userId: z.number().int(),
    recipientId: z.number().int(),
    requestId: z.number().int()
});

export type AddFriendFromRequestInput = z.infer<typeof addFriendFromRequestSchema>;